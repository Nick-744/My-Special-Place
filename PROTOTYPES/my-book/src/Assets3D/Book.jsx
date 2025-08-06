import { degToRad, MathUtils } from 'three/src/math/MathUtils.js'
import { useEffect, useRef, useState } from 'react'
import { pages } from '../InfoData/PagesContent'
import { createTextPageMesh } from './TextPage'
import { useCursor } from '@react-three/drei'
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

const Page = (
    { number, front, back, page, opened, bookClosed, ...props }
) => {
    const group          = useRef()
    const skinnedMeshRef = useRef()
    const turnedAt       = useRef(0)
    const lastOpened     = useRef(opened)

    const [_, setPage] = useAtom(pageAtom)
    const [textPageData, setTextPageData] = useState(null)
    const [highlighted, setHighlighted]   = useState(false)
    
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

    // All other hooks must come before any conditional returns!
    useCursor(highlighted)

    // Function to handle clicks on clickable areas
    const handleClickableAreaClick = (event) => {
        if (!textPageData || !skinnedMeshRef.current) return false;

        // Get the intersection point on the mesh
        const raycaster = new Raycaster()
        const mouse     = new Vector2()
        
        // Convert mouse position to normalized device coordinates
        const rect = event.target.getBoundingClientRect()
        mouse.x    = +((event.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y    = -((event.clientY - rect.top) / rect.height) * 2 + 1
        
        // Set up raycaster
        raycaster.setFromCamera(mouse, event.camera)
        
        // Check intersection with the page mesh
        const intersects = raycaster.intersectObject(skinnedMeshRef.current, false)
        
        if (intersects.length > 0) {
            const intersection = intersects[0]
            const uv = intersection.uv
            
            if (!uv) return false;
            
            // Determine which side was clicked (front or back)
            const faceIndex  = intersection.face.materialIndex
            const isBackSide = faceIndex === 5 // Back material index
            
            const clickableAreas = isBackSide
                ? textPageData.backClickableAreas
                : textPageData.frontClickableAreas
            
            // Convert UV coordinates to canvas coordinates
            const canvasWidth  = 1200
            const canvasHeight = 1500
            const canvasX      = uv.x * canvasWidth
            const canvasY      = (1 - uv.y) * canvasHeight // Flip Y coordinate
            
            // Check if click is within any clickable area
            for (const area of clickableAreas) {
                if (canvasX >= area.x && 
                    canvasX <= area.x + area.width &&
                    canvasY >= area.y && 
                    canvasY <= area.y + area.height) {
                    
                    if (area.type === 'image') {
                        // Handle image click - open in new tab/modal
                        window.open(area.src, '_blank')

                        return true;
                    }
                    else if (area.type === 'link') {
                        // Handle link click - open URL in new tab
                        window.open(area.url, '_blank')

                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    // ----- Update the bones in the skinned mesh every frame ----- //
    useFrame((_, dt) => {
        if (!skinnedMeshRef.current) return;

        // Subtle glow effect that doesn't interfere with text readability!!!
        const emissiveIntensity = highlighted ? 0.05 : 0 // Reduced intensity
        
        // Only apply glow to non-text materials (materials 0-3).
        // Leave text materials (4-5) unchanged to preserve crispness...
        if (skinnedMeshRef.current.material[0]) {
            skinnedMeshRef.current.material[0].emissiveIntensity = 
            skinnedMeshRef.current.material[1].emissiveIntensity =
            skinnedMeshRef.current.material[2].emissiveIntensity =
            skinnedMeshRef.current.material[3].emissiveIntensity = MathUtils.lerp(
                skinnedMeshRef.current.material[0].emissiveIntensity || 0,
                emissiveIntensity,
                0.1
            )
        }
        
        // Keep text materials (4-5) always at 0 emissive intensity for crispness!
        if (skinnedMeshRef.current.material[4])
            skinnedMeshRef.current.material[4].emissiveIntensity = 0
        if (skinnedMeshRef.current.material[5])
            skinnedMeshRef.current.material[5].emissiveIntensity = 0

        if (lastOpened.current !== opened) {
            turnedAt.current   = + new Date()
            lastOpened.current = opened
        }
        let turningTime = Math.min(400, new Date() - turnedAt.current) / 400
        turningTime     = Math.sin(turningTime * Math.PI)

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
        if (!bookClosed)
            targetRotation += degToRad(number * 0.8)

        const bones = skinnedMeshRef.current.skeleton.bones
        for (let i = 0; i < bones.length; i++) {
            const target = i === 0 ? group.current : bones[i]

            const insideCurveIntensity  = i < 12 ?
                                            Math.sin(i * 0.3) : 0
            const outsideCurveIntensity = i >= 12 ?
                                            Math.sin(i * 0.12 - 0.2) * 0.6 : 0
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
        onPointerEnter = {(e) => {
            e.stopPropagation()
            setHighlighted(true)
        }}
        onPointerLeave = {(e) => {
            e.stopPropagation()
            setHighlighted(false)
        }}
        onClick = {(e) => {
            e.stopPropagation()
            
            // --- First check if click was on a clickable area --- //
            if (handleClickableAreaClick(e)) {
                setHighlighted(false)

                return; // Don't turn page if we clicked on an image/link
            }
            
            // Otherwise, turn the page...
            setPage(opened ? number : number + 1)
            setHighlighted(false)
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

const Book = ({ ...props }) => {
    const [page] = useAtom(pageAtom)
    const [delayedPage, setDelayedPage] = useState(page)

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
                {...pageData}
                />
            ))}
        </group>
    );
}

export default Book;
