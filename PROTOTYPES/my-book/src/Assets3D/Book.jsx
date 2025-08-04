import {
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_THICKNESS,
    PAGE_SEGMENTS,
    SEGMENT_WIDTH
} from '../MyConfig'

import {
    BoxGeometry,
    Vector3,
    Uint16BufferAttribute,
    Float32BufferAttribute,
    Bone,
    Skeleton,
    SkinnedMesh,
    Color,
    MeshStandardMaterial,
    SRGBColorSpace
} from 'three'

import { degToRad } from 'three/src/math/MathUtils.js'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { pageAtom, pages } from './UI'
import { useAtom } from 'jotai'

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
const whiteColor = new Color('white')
const pageMaterials = [
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.1
    }), // Right face (positive X)
    new MeshStandardMaterial({ 
        color:     '#111',
        roughness: 0.1
    }), // Left face (negative X)
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.1
    }), // Top face (positive Y)
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.1
    }) // Bottom face (negative Y)

    // See Page component for front and back materials!
]

// Preload all textures for the pages
pages.forEach((page) => {
    useTexture.preload(`/textures/${page.front}.jpg`)
    useTexture.preload(`/textures/${page.back}.jpg`)
    useTexture.preload('/textures/book-cover-roughness.jpg')
})

const Page = ({ number, front, back, page, ...props }) => {
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

    /* Skeletal animation system for rendering realistic
    book pages that can bend and curve naturally */
    const manualSkinnedMesh = useMemo(() => {
        const bones = []
        for (let i = 0; i <= PAGE_SEGMENTS; i++) {
            let bone  = new Bone()
            bone.name = `bone_${i}` // Add names for debugging!
            bones.push(bone)

            if (i === 0) bone.position.set(0, 0, 0)
            else {
                bone.position.set(SEGMENT_WIDTH, 0, 0)
                // Attach the new bone to the previous one
                bones[i - 1].add(bone)
            }
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
                )
            }), // Front face material
            new MeshStandardMaterial({ 
                color: whiteColor,
                map:   pictureBack,
                ...(number === pages.length - 1
                    ? {roughnessMap: pictureRoughness}
                    : {roughness:    0.1}
                )
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

    useFrame(() => {
        if (!skinnedMeshRef.current) return;

        const bones = skinnedMeshRef.current.skeleton.bones
    })

    return (
        <group {...props} ref = {group}>
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

    return (
        <group {...props}>
            {[...pages].map((pageData, index) => (
                <Page
                key    = {index}
                page   = {page}
                number = {index}
                {...pageData}
                />
            ))}
        </group>
    );
}

export default Book;
