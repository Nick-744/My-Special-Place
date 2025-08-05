import { degToRad, MathUtils } from 'three/src/math/MathUtils.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { pageAtom, pages } from '../Assets2D/UI'
import { createTextPageMesh } from './TextPage'
import { useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
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

    // Create the text page mesh using useMemo
    const textPageData = useMemo(() => {
        return createTextPageMesh(
            front || `Page ${number * 2 + 1}`, 
            back  || `Page ${number * 2 + 2}`
        );
    }, [front, back, number])

    const [_, setPage] = useAtom(pageAtom)
    const [highlighted, setHighlighted] = useState(false)
    useCursor(highlighted)

    // ----- Update the bones in the skinned mesh every frame ----- //
    useFrame((_, dt) => {
        if (!skinnedMeshRef.current) return;

        // Make the book pages glow when hovered!
        const emissiveIntensity = highlighted ? 0.2 : 0
        skinnedMeshRef.current.material[4].emissiveIntensity =
            skinnedMeshRef.current.material[5].emissiveIntensity = MathUtils.lerp(
                skinnedMeshRef.current.material[4].emissiveIntensity,
                emissiveIntensity,
                0.1
            )

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
