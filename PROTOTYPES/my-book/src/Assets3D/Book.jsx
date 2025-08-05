// ==================== Animation Configuration ==================== //
const easingFactor         = 0.5  // Controls the speed of the easing
const easingFactorFold     = 0.3  // Controls the speed of the easing
const insideCurveStrength  = 0.18 // Controls the strength of the curve
const outsideCurveStrength = 0.05 // Controls the strength of the curve
const turningCurveStrength = 0.1  // Controls the strength of the curve

// ==================== Pages Configuration ==================== //
const PAGE_WIDTH     = 1.28
const PAGE_HEIGHT    = 1.71 // 4:3 aspect ratio
const PAGE_THICKNESS = 0.003
const PAGE_SEGMENTS  = 50
const SEGMENT_WIDTH  = PAGE_WIDTH / PAGE_SEGMENTS

import {
    Float32BufferAttribute,    
    Uint16BufferAttribute,
    MeshStandardMaterial,
    SRGBColorSpace,
    BoxGeometry,
    SkinnedMesh,
    Skeleton,
    Vector3,
    Color,
    Bone
} from 'three'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useCursor, useTexture } from '@react-three/drei'
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js'
import { useFrame } from '@react-three/fiber'
import { pageAtom, pages } from './UI'
import { useAtom } from 'jotai'
import { easing } from 'maath'

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_THICKNESS,
    PAGE_SEGMENTS,
    2
)

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position    = pageGeometry.attributes.position
const vertex      = new Vector3()
const skinIndexes = []
const skinWeights = []

// Calculate skinIndex and skinWeight for each vertex
for (let i = 0; i < position.count; i++) {
    // ALL VERTICES
    vertex.fromBufferAttribute(position, i) // Get the vertex position
    const x = vertex.x // Get the x position of the vertex

    // Calculate the skin index based on the x position
    const skinIndex  = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
    // Calculate the skin weight based on the x position
    let   skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

    skinIndexes.push(skinIndex,      skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight,    0, 0)
}

// Set the skinIndex and skinWeight attributes for the geometry.
// This is used for skeletal animation...
pageGeometry.setAttribute(
    'skinIndex',
    new Uint16BufferAttribute(skinIndexes, 4)
)
pageGeometry.setAttribute(
    'skinWeight',
    new Float32BufferAttribute(skinWeights, 4)
)

// Set the material for the book pages
// The front and back faces will be added in the Page component!
const whiteColor    = new Color('white')
const emissiveColor = new Color('orange')
const pageMaterials = [
    new MeshStandardMaterial({ color: whiteColor }), // Right face
    new MeshStandardMaterial({ color: '#111'     }), // Left face
    new MeshStandardMaterial({ color: whiteColor }), // Top face
    new MeshStandardMaterial({ color: whiteColor })  // Bottom face

    // See Page component for front & back materials!
]

// Preload all textures for the pages
pages.forEach((page) => {
    useTexture.preload(`/textures/${page.front}.jpg`)
    useTexture.preload(`/textures/${page.back}.jpg`)
    useTexture.preload('/textures/book-cover-roughness.jpg')
})

const Page = (
    { number, front, back, page, opened, bookClosed,...props }
) => {
    const [picture, pictureBack, pictureRoughness] = useTexture([
        `/textures/${front}.jpg`,
        `/textures/${back}.jpg`,
        ...(number === 0 || number === pages.length - 1
        ? ['/textures/book-cover-roughness.jpg']
        : [])
    ])
    // Set the color space for the textures:
    picture.colorSpace = pictureBack.colorSpace = SRGBColorSpace

    const group          = useRef()
    const skinnedMeshRef = useRef()
    const turnedAt       = useRef(0)
    const lastOpened     = useRef(opened)

    /* Skeletal animation system for rendering realistic
    book pages that can bend and curve naturally */
    const manualSkinnedMesh = useMemo(() => {
        const bones = []
        for (let i = 0; i <= PAGE_SEGMENTS; i++) {
            let bone = new Bone()
            bones.push(bone)

            if (i === 0)
                bone.position.x = 0
            else
                bone.position.x = SEGMENT_WIDTH
            
            if (i > 0) 
                bones[i - 1].add(bone) // Attach the new bone to the previous one!
        }
        
        const skeleton     = new Skeleton(bones)

        const materials    = [
            ...pageMaterials,
            new MeshStandardMaterial({
                color: whiteColor,
                map:   picture,
                ...(number === 0
                    ? {roughnessMap: pictureRoughness}
                    : {roughness:    0.1}
                ),

                emissive:          emissiveColor,
                emissiveIntensity: 0
            }), // Front face material
            new MeshStandardMaterial({ 
                color: whiteColor,
                map:   pictureBack,
                ...(number === pages.length - 1
                    ? {roughnessMap: pictureRoughness}
                    : {roughness:    0.1}
                ),

                emissive:          emissiveColor,
                emissiveIntensity: 0
            }) // Back face material
        ]

        const mesh         = new SkinnedMesh(pageGeometry, materials)
        mesh.castShadow    = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0]) // Add the first bone to the mesh!
        mesh.bind(skeleton)

        return mesh;
    }, [])

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
                                            Math.sin(i * 0.1 - 0.1) * 0.6 : 0
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
                target.rotation, 'x', foldRotationAngle * foldIntensity, easingFactorFold, dt
            )
        }
    })

    const [_, setPage] = useAtom(pageAtom)
    const [highlighted, setHighlighted] = useState(false)
    useCursor(highlighted)

    return (
        <group {...props} ref = {group}
        onPointerEnter={(e) => {
            e.stopPropagation()
            setHighlighted(true)
        }}
        onPointerLeave={(e) => {
            e.stopPropagation()
            setHighlighted(false)
        }}
        onClick={(e) => {
            e.stopPropagation()
            setPage(opened ? number : number + 1)
            setHighlighted(false)
        }}
        >
            <primitive 
            object     = {manualSkinnedMesh} 
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
