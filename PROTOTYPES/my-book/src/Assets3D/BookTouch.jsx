import { degToRad } from 'three/src/math/MathUtils.js'
import { useEffect, useRef, useState } from 'react'
import { usePages } from '../InfoData/PagesContent'
import { createTextPageMesh } from './TextPage'
import { useFrame } from '@react-three/fiber'
import { Vector2, Raycaster } from 'three'
import { pageAtom } from '../Assets2D/UI'
import { useAtom } from 'jotai'
import { easing } from 'maath'

// ==================== Animation Configuration ==================== //
let   easingFactor         = 0.02 // General smoothing factor for main motion
const easingFactorFold     = 0.3  // Smoothing specifically for fold animation
const insideCurveStrength  = 0.18 // Strength of curvature on the page interior
const outsideCurveStrength = 0.05 // Strength of curvature on the page exterior
const turningCurveStrength = 0.1  // Strength of the turning crease / hinge curvature

// - easingFactor:
//   Start with a very small easingFactor to avoid an initialization
// artifact where 1 page can briefly intersect another while the skinned
// meshes and bones are first created...

// ==================== Pages Configuration ==================== //
const PAGE_THICKNESS = 0.001
const DRAG_DISTANCE_BASE = 300 // fallback base

const Page = ({
    number, front, back, page, opened, bookClosed,
    setModalImageSrc, setModalOpen,
    canDragForward, canDragBackward,
    hasEverOpened, // NEW
    ...props
}) => {
    const group          = useRef()
    const skinnedMeshRef = useRef()
    const turnedAt       = useRef(0)
    const lastOpened     = useRef(opened)

    // Drag + snap state
    const isDraggingRef           = useRef(false)
    const isSnappingRef           = useRef(false)
    const dragProgressRef         = useRef(opened ? 1 : 0) // 0 closed, 1 open
    const targetProgressRef       = useRef(null)
    const dragStartXRef           = useRef(0)
    const dragOriginalProgressRef = useRef(0)
    const dragMovedRef            = useRef(false)
    const directionRef            = useRef(0)  // +1 = forward(open), -1 = backward(close)
    const velocityRef             = useRef(0)
    const lastSampleXRef          = useRef(0)
    const lastSampleTRef          = useRef(0)
    const dynamicDistanceRef      = useRef(DRAG_DISTANCE_BASE)
    const preventScrollRef        = useRef(false)

    const clamp = (v,a=0,b=1)=>Math.min(b,Math.max(a,v))

    useEffect(() => {
        if (!isDraggingRef.current && !isSnappingRef.current)
            dragProgressRef.current = opened ? 1 : 0
    }, [opened])

    // Prevent page scroll while dragging touch
    useEffect(()=>{
        const onTouchMove = e => {
            if (preventScrollRef.current) e.preventDefault()
        }
        window.addEventListener('touchmove', onTouchMove, { passive:false })
        return ()=>window.removeEventListener('touchmove', onTouchMove)
    }, [])

    const [_, setPage] = useAtom(pageAtom)
    const [textPageData, setTextPageData] = useState(null)
    
    // Load page data effect - always called
    useEffect(() => {
        const loadPageData = async () => {
            try {
                const data = await createTextPageMesh(
                    front || `Page ${number * 2 + 1}`, 
                    back  || `Page ${number * 2 + 2}`
                )
                setTextPageData(data)
            }
            catch (error) {
                console.error('Failed to create page mesh:', error)
            }
        }
        
        loadPageData()
    }, [front, back, number])

    /* This function determines if a user's pointer event
    intersects with any defined 'clickable areas' on the 3D
    book page mesh. It is used to enable interactive regions
    (like images, links, etc.) on the book's pages. */
    const checkClickableArea = (event) => {
        if (!textPageData || !skinnedMeshRef.current) return null;

        // Use manual raycaster setup!
        const raycaster = new Raycaster()
        const mouse     = new Vector2()

        // [IMPORTANT] - Convert to normalized device coordinates...
        mouse.x = +(event.clientX / window.innerWidth ) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        
        raycaster.setFromCamera(mouse, event.camera)
        const intersects = raycaster.intersectObject(skinnedMeshRef.current, false)
        if (!intersects.length) return null;
        
        const intersection = intersects[0]
        const uv           = intersection.uv
        if (!uv) return null;
        
        // Determine which side was clicked (front or back)
        const faceIndex  = intersection.face.materialIndex
        const isBackSide = faceIndex === 5 // Back material index
        
        const clickableAreas = isBackSide
            ? textPageData.backClickableAreas
            : textPageData.frontClickableAreas
        
        // Get texture dimensions from the correct side
        const mat = skinnedMeshRef.current.material[
            intersection.face.materialIndex
        ]
        const tex = mat?.map
        if (!tex?.image) return null;

        const canvasWidth  = tex.image.width
        const canvasHeight = tex.image.height

        // Convert UV to pixel coordinates
        const canvasX = isBackSide
                            ? (1 - uv.x) * canvasWidth
                            : uv.x * canvasWidth
        const canvasY = (1 - uv.y) * canvasHeight
        // Flip Y to match image origin!!!

        // Check if point is within any clickable area
        for (const area of clickableAreas)
            if (
                canvasX >= area.x &&
                canvasX <= area.x + area.width &&
                canvasY >= area.y &&
                canvasY <= area.y + area.height
            ) return area;
        
        return null;
    }

    // Function to handle clicks on clickable areas
    const handleClickableAreaClick = (event) => {
        const area = checkClickableArea(event);
        
        if (area) {
            if (area.type === 'image') {
                // Open modal with image
                setModalImageSrc(area.src)
                setModalOpen(true)

                return true;
            }
            else if (area.type === 'link') {
                // Handle link click - open URL in new tab
                window.open(area.url, '_blank')

                return true;
            }
        }
        
        return false;
    }

    // Function to handle pointer enter/leave for cursor changes
    const handlePointerMove = (event) => {
        if (isDraggingRef.current) return
        const area = checkClickableArea(event)
        document.body.style.cursor = area ? 'pointer' : 'auto'
    }
    const handlePointerLeave = () => { if(!isDraggingRef.current) document.body.style.cursor = 'auto' }

    // ----- Update the bones in the skinned mesh every frame ----- //
    useFrame((_, dt) => {
        if (!skinnedMeshRef.current) return
        // Handle snapping animation
        if (isSnappingRef.current) {
            const cur = dragProgressRef.current
            const tgt = targetProgressRef.current
            const next = cur + (tgt - cur) * Math.min(1, 10 * dt)
            dragProgressRef.current = next
            if (Math.abs(tgt - next) < 0.001) {
                dragProgressRef.current = tgt
                isSnappingRef.current = false
            }
        }

        const progressing   = isDraggingRef.current || isSnappingRef.current
        const draggingLive  = isDraggingRef.current
        const dragProgress  = dragProgressRef.current

        if (lastOpened.current !== opened && !progressing) {
            turnedAt.current   = Date.now()
            lastOpened.current = opened
        }

        let turningTime
        if (progressing)
            // Slightly flatter curve (less dramatic while dragging)
            turningTime = Math.sin(dragProgress * Math.PI) ** 1.0
        else {
            turningTime = Math.min(400, Date.now() - turnedAt.current) / 400
            turningTime = Math.sin(turningTime * Math.PI)
        }

        let baseRotation
        if (progressing) {
            baseRotation = (1 - 2 * dragProgress) * Math.PI / 2
            if (!bookClosed) baseRotation += degToRad(number * 0.12) * (1 - turningTime)
        } else {
            let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
            if (!bookClosed) targetRotation += degToRad(number * 0.18)
            baseRotation = targetRotation
        }

        const bones = skinnedMeshRef.current.skeleton.bones
        for (let i = 0; i < bones.length; i++) {
            const boneTarget = i === 0 ? group.current : bones[i]

            const insideCurveIntensity  = i < 12 ? Math.sin(i * 0.3) * 0.08 + 0.35 : 0
            const outsideCurveIntensity = i >=12 ? Math.sin(i * 0.12 - 0.2) * 0.08 : 0
            const turningCurveIntensity = Math.sin(i * Math.PI + (1 / bones.length)) * turningTime

            let rotationAngle =
                insideCurveStrength  * insideCurveIntensity  * baseRotation -
                outsideCurveStrength * outsideCurveIntensity * baseRotation +
                turningCurveStrength * turningCurveIntensity * baseRotation

            if (progressing) {
                // Reduced boost (was 0.15)
                const centerBoost = (1 - Math.abs(0.5 - dragProgress) * 2) * 0.05
                rotationAngle += rotationAngle * centerBoost
            }

            // Reduced fold amplitude (was 2.2)
            let foldRotationAngle = degToRad(Math.sign(baseRotation) * 0.2)

            if (bookClosed && !progressing) {
                if (i === 0) {
                    rotationAngle     = baseRotation
                    foldRotationAngle = 0
                } else {
                    rotationAngle     = 0
                    foldRotationAngle = 0
                }
            }

            easing.dampAngle(
                boneTarget.rotation, 'y', rotationAngle,
                progressing ? 0.16 : easingFactor, dt
            )

            const foldIntensity = i > 12
                ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
                : 0

            easing.dampAngle(
                boneTarget.rotation, 'x',
                foldRotationAngle * foldIntensity,
                progressing ? 0.35 : easingFactorFold, dt
            )
        }
    })

    if (!textPageData) return <group {...props} />

    // Decide target snap based on progress & velocity
    const decideTarget = (p, v) => {
        const fast = Math.abs(v) > 1.2
        const dir = directionRef.current
        if (dir === 1) { // opening forward
            if (p > 0.55 || (fast && v > 0)) return 1
            if (p < 0.35 || (fast && v < 0)) return 0
            return p >= 0.5 ? 1 : 0
        } else { // closing backward
            if (p < 0.45 || (fast && v < 0)) return 0
            if (p > 0.65 || (fast && v > 0)) return 1
            return p >= 0.5 ? 1 : 0
        }
    }

    const beginDrag = (e) => {
        if (!(canDragForward || canDragBackward)) return
        // Block drag if the book is still fully closed and has never been opened yet
        if (bookClosed && !hasEverOpened) return
        dynamicDistanceRef.current = Math.min(420, Math.max(180, window.innerWidth * 0.4))
        isDraggingRef.current = true
        isSnappingRef.current = false
        targetProgressRef.current = null
        directionRef.current = canDragForward ? 1 : -1
        dragStartXRef.current = e.clientX
        dragOriginalProgressRef.current = dragProgressRef.current
        dragMovedRef.current = false
        velocityRef.current = 0
        lastSampleXRef.current = e.clientX
        lastSampleTRef.current = performance.now()
        preventScrollRef.current = true
        document.body.style.cursor = 'grabbing'
        if (e.target.setPointerCapture) {
            try { e.target.setPointerCapture(e.pointerId) } catch {}
        }
    }

    const updateDrag = (e) => {
        if (!isDraggingRef.current) return
        const deltaX = e.clientX - dragStartXRef.current
        const dist   = dynamicDistanceRef.current
        // Unified formula:
        //  - Drag left  (deltaX negative) -> increases progress (opening)
        //  - Drag right (deltaX positive) -> decreases progress (closing)
        const progressDelta = (-deltaX) / dist
        const progress = clamp(dragOriginalProgressRef.current + progressDelta)
        dragProgressRef.current = progress
        if (Math.abs(deltaX) > 4) dragMovedRef.current = true

        const now = performance.now()
        const dt  = now - lastSampleTRef.current
        if (dt > 16) {
            const dx = e.clientX - lastSampleXRef.current
            const progDx = (-dx) / dist
            const v = progDx / (dt / 1000)
            velocityRef.current = velocityRef.current * 0.7 + v * 0.3
            lastSampleXRef.current = e.clientX
            lastSampleTRef.current = now
        }
    }

    const startSnap = (target) => {
        isDraggingRef.current = false
        isSnappingRef.current = false   // don't animate
        targetProgressRef.current = target
        dragProgressRef.current = target // instantly set
        preventScrollRef.current = false
        document.body.style.cursor = 'auto'

        if (target === 1 && directionRef.current === 1) {
            setPage(number + 1)
        } else if (target === 0 && directionRef.current === 1) {
            setPage(number)
        } else if (target === 0 && directionRef.current === -1) {
            setPage(number)
        } else if (target === 1 && directionRef.current === -1) {
            setPage(number + 1)
        }
    }

    const endDrag = () => {
        if (!isDraggingRef.current) return
        const target = decideTarget(dragProgressRef.current, velocityRef.current)
        startSnap(target)
    }

    const cancelDrag = () => {
        if (!isDraggingRef.current) return
        startSnap(dragProgressRef.current >= 0.5 ? 1 : 0)
    }

    return (
        <group
            {...props}
            ref={group}
            onPointerEnter={(e)=>{ e.stopPropagation() }}
            onPointerLeave={(e)=>{
                e.stopPropagation()
                handlePointerLeave()
                if (isDraggingRef.current) endDrag()
            }}
            onPointerDown={(e)=>{
                e.stopPropagation()
                if (isSnappingRef.current) return
                const area = checkClickableArea(e)
                if (area) return
                beginDrag(e)
            }}
            onPointerMove={(e)=>{
                e.stopPropagation()
                if (isDraggingRef.current) updateDrag(e)
                else handlePointerMove(e)
            }}
            onPointerUp={(e)=>{
                e.stopPropagation()
                if (isDraggingRef.current) endDrag()
            }}
            onPointerCancel={(e)=>{
                e.stopPropagation()
                cancelDrag()
            }}
            onLostPointerCapture={()=>{
                if (isDraggingRef.current) endDrag()
            }}
            onClick={(e)=>{
                e.stopPropagation()
                if (dragMovedRef.current || isSnappingRef.current){
                    dragMovedRef.current = false
                    return
                }
                if (handleClickableAreaClick(e)) return
                setPage(opened ? number : number + 1)
            }}
        >
            <primitive
                object={textPageData.mesh}
                ref={skinnedMeshRef}
                position-z={-number * PAGE_THICKNESS + page * PAGE_THICKNESS}
            />
        </group>
    )
}

const BookTouch = ({ setModalImageSrc, setModalOpen, onCurrentPageChange, ...props }) => {
    // === ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS === //
    const { pages, loading, error     } = usePages()
    const [page                       ] = useAtom(pageAtom)
    const [delayedPage, setDelayedPage] = useState(page)
    const hasEverOpenedRef = useRef(false)          // NEW: tracks if user has opened at least once
    useEffect(() => { if (delayedPage > 0) hasEverOpenedRef.current = true }, [delayedPage])

    // ...Set the easingFactor to its final value
    // after the Book has been fully initialized!
    useEffect(() => { if (!loading) { easingFactor = 0.5 } }, [page])

    // Notify parent about current page content changes!
    useEffect(() => {
        if (onCurrentPageChange) {
            // Determine which pages are currently visible
            let leftContent  = null
            let rightContent = null

            // Book is closed, show cover
            if (delayedPage === 0)
                rightContent = pages[0]?.front
            // Book is fully open, show back cover
            else if (delayedPage === pages.length)
                leftContent = pages[pages.length - 1]?.back
            // Book is open to a specific page
            else {
                const currentPageIndex = delayedPage - 1
                
                if (currentPageIndex >= 0 && currentPageIndex < pages.length)
                    leftContent = pages[currentPageIndex]?.back
                
                if (currentPageIndex + 1 >= 0 && currentPageIndex + 1 < pages.length)
                    rightContent = pages[currentPageIndex + 1]?.front
            }

            onCurrentPageChange(leftContent, rightContent)
        }
    }, [delayedPage, onCurrentPageChange, pages])

    /* Progressive page-turning animation system that smoothly transitions
    between pages in a book interface. Rather than jumping directly from
    one page to another, it creates a realistic page-by-page progression
    that mimics how users would naturally flip through a physical book! */
    useEffect(() => {
        let timeout

        const goToPage = () => {
            setDelayedPage((delayedPage) => {
                if (page === delayedPage) return delayedPage;
                else
                    timeout = setTimeout(() => {
                        goToPage()
                    }, Math.abs(page - delayedPage) > 2 ? 50 : 150)

                    if (page > delayedPage) return delayedPage + 1;
                    if (page < delayedPage) return delayedPage - 1;
            })
        }

        goToPage()

        return () => { clearTimeout(timeout) };
    }, [page])

    // === HANDLE CONDITIONAL RENDERING AFTER ALL HOOKS === //
    if (loading)
        return (
            <group {...props}>
                <mesh>
                    <boxGeometry args = {[2, 3, 0.1]} />
                    <meshBasicMaterial color = '#ccc' />
                </mesh>
            </group>
        );

    if (error) console.error('Error loading pages:', error);

    return (
        <group {...props} rotation-y = {-Math.PI / 2}>
            {[...pages].map((pageData, index) => {
                const canDragForward  = index === delayedPage
                const canDragBackward = index === delayedPage - 1
                return (
                    <Page
                        key              = {index}
                        page             = {delayedPage}
                        number           = {index}
                        opened           = {delayedPage > index}
                        bookClosed       = {delayedPage === 0 || delayedPage === pages.length}
                        canDragForward   = {canDragForward}
                        canDragBackward  = {canDragBackward}
                        hasEverOpened    = {hasEverOpenedRef.current}  // now defined
                        setModalImageSrc = {setModalImageSrc}
                        setModalOpen     = {setModalOpen}
                        {...pageData}
                    />
                )
            })}
        </group>
    );
}

export default BookTouch;
