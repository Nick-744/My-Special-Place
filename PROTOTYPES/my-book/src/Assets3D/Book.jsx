import { degToRad } from 'three/src/math/MathUtils.js'
import { useEffect, useRef, useState } from 'react'
import { pages } from '../InfoData/PagesContent'
import { createTextPageMesh } from './TextPage'
import { useFrame } from '@react-three/fiber'
import { Vector2, Raycaster } from 'three'
import { pageAtom } from '../Assets2D/UI'
import { useAtom } from 'jotai'
import { easing } from 'maath'

// ==================== Animation Configuration ==================== //
const easingFactor         = 0.5  // Controls the speed of the easing
const easingFactorFold     = 0.3  // Controls the speed of the easing
const insideCurveStrength  = 0.18 // Controls the strength of the curve
const outsideCurveStrength = 0.05 // Controls the strength of the curve
const turningCurveStrength = 0.1  // Controls the strength of the curve

// ==================== Pages Configuration ==================== //
const PAGE_THICKNESS = 0.003

const Page = ({
    number, front, back, page, opened, bookClosed,
    setModalImageSrc, setModalOpen,
    ...props
}) => {
    const group          = useRef()
    const skinnedMeshRef = useRef()
    const turnedAt       = useRef(0)
    const lastOpened     = useRef(opened)

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

    // Function to check if point is within clickable areas
    const checkClickableArea = (event) => {
        if (!textPageData || !skinnedMeshRef.current) return null;

        // Use existing raycaster from event or fallback to manual raycaster setup!
        let intersects
        if (event.raycaster)
            intersects = event.raycaster.intersectObject(skinnedMeshRef.current, false)
        else {
            // Fallback: create our own raycaster
            const raycaster = new Raycaster()
            const mouse     = new Vector2()
            
            // Use event.point for normalized coordinates
            mouse.copy(event.point)
            raycaster.setFromCamera(mouse, event.camera)
            intersects = raycaster.intersectObject(skinnedMeshRef.current, false)
        }
        
        if (intersects.length > 0) {
            const intersection = intersects[0]
            const uv           = intersection.uv
            
            if (!uv) return null;
            
            // Determine which side was clicked (front or back)
            const faceIndex  = intersection.face.materialIndex
            const isBackSide = faceIndex === 5 // Back material index
            
            const clickableAreas = isBackSide
                ? textPageData.backClickableAreas
                : textPageData.frontClickableAreas
            
            // Convert UV coordinates to canvas coordinates
            // YOU HAVE TO ADJUST THESE VALUES BASED ON YOUR CANVAS SIZE!
            const canvasWidth  = 800  // ~ Half of the page width...
            const canvasHeight = 1370 // Account for book's y position!
            const canvasX      = uv.x * canvasWidth
            const canvasY      = (1 - uv.y) * canvasHeight // Flip Y coordinate
            
            // Check if point is within any clickable area
            for (const area of clickableAreas) {
                if (canvasX >= area.x && 
                    canvasX <= area.x + area.width &&
                    canvasY >= area.y && 
                    canvasY <= area.y + area.height) return area;
            }
        }
        
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
        const area = checkClickableArea(event)
        
        if (area) document.body.style.cursor = 'pointer'
        else      document.body.style.cursor = 'auto'
    }

    const handlePointerLeave = () => { document.body.style.cursor = 'auto' }

    // ----- Update the bones in the skinned mesh every frame ----- //
    useFrame((_, dt) => {
        if (!skinnedMeshRef.current) return;

        if (lastOpened.current !== opened) {
            turnedAt.current   = + new Date()
            lastOpened.current = opened
        }
        let turningTime = Math.min(400, new Date() - turnedAt.current) / 400
        turningTime     = Math.sin(turningTime * Math.PI)

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
        
        if (!bookClosed) targetRotation += degToRad(number * 0.9)

        const bones = skinnedMeshRef.current.skeleton.bones
        for (let i = 0; i < bones.length; i++) {
            const target = i === 0 ? group.current : bones[i]

            const insideCurveIntensity  = i < 12 ?
                                            Math.sin(i * 0.3) : 0
            const outsideCurveIntensity = i >= 12 ?
                                            Math.sin(i * 0.12 - 0.2) * 0.5 : 0
            const turningCurveIntensity =
                Math.sin(i * Math.PI + (1 / bones.length)) * turningTime
            
            let rotationAngle =
                insideCurveStrength  * insideCurveIntensity  * targetRotation -
                outsideCurveStrength * outsideCurveIntensity * targetRotation +
                turningCurveStrength * turningCurveIntensity * targetRotation

            let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2)
            
            if (bookClosed)
                if (i === 0) {
                    rotationAngle     = targetRotation
                    foldRotationAngle = 0
                }
                else {
                    rotationAngle     = 0
                    foldRotationAngle = 0
                }

            easing.dampAngle(
                target.rotation, 'y', rotationAngle, easingFactor, dt
            )

            const foldIntensity = i > 8 ?
                Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0

            easing.dampAngle(
                target.rotation,
                'x',
                foldRotationAngle * foldIntensity,
                easingFactorFold,
                dt
            )
        }
    })

    // CONDITIONAL RETURN COMES AFTER ALL HOOKS
    if (!textPageData) return <group {...props} />; // Return empty group while loading!

    return (
        <group {...props} ref = {group}
        onPointerEnter = {(e) => { e.stopPropagation() }}
        onPointerLeave = {(e) => { 
            e.stopPropagation()
            handlePointerLeave()
        }}
        onPointerMove = {(e) => {
            e.stopPropagation()
            handlePointerMove(e)
        }}
        onClick = {(e) => {
            e.stopPropagation()
            
            // --- First check if click was on a clickable area --- //
            if (handleClickableAreaClick(e))
                return; // Don't turn page if we clicked on an image/link!
            
            // Otherwise, turn the page...
            setPage(opened ? number : number + 1)
        }}
        >
            <primitive 
            object     = {textPageData.mesh}
            ref        = {skinnedMeshRef}
            position-z = {
                -number * PAGE_THICKNESS + page * PAGE_THICKNESS
            }
            />
        </group>
    );
}

const Book = ({ setModalImageSrc, setModalOpen, onCurrentPageChange, ...props }) => {
    const [page] = useAtom(pageAtom)
    const [delayedPage, setDelayedPage] = useState(page)

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
    }, [delayedPage, onCurrentPageChange])

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

    return (
        <group {...props} rotation-y = {-Math.PI / 2}>
            {[...pages].map((pageData, index) => (
                <Page
                key        = {index}
                page       = {delayedPage}
                number     = {index}
                opened     = {delayedPage > index}
                bookClosed = {delayedPage === 0 || delayedPage === pages.length}

                setModalImageSrc = {setModalImageSrc}
                setModalOpen     = {setModalOpen}

                {...pageData}
                />
            ))}
        </group>
    );
}

export default Book;
