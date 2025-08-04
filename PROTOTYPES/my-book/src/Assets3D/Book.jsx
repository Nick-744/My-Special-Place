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
    MeshStandardMaterial
} from 'three'

import { useMemo, useRef } from 'react'
import { pages } from './UI'

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

for (let i = 0; i < position.count; i++) {
    // ALL VERTICES
    vertex.fromBufferAttribute(position, i) // Get the vertex position
    const x = vertex.x // Get the x position of the vertex

    // Calculate the skin index based on the x position
    const skinIndex  = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
    // Calculate the skin weight based on the x position
    let   skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

    skinIndexes.push(skinIndex, Math.min(skinIndex + 1, PAGE_SEGMENTS), 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute(
    'skinIndex',
    new Uint16BufferAttribute(skinIndexes, 4)
)

pageGeometry.setAttribute(
    'skinWeight',
    new Float32BufferAttribute(skinWeights, 4)
)

const whiteColor = new Color('white')
const pageMaterials = [
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.8,
        metalness: 0.1
    }), // Right face (positive X)
    new MeshStandardMaterial({ 
        color:     '#111',
        roughness: 0.9,
        metalness: 0.0
    }), // Left face (negative X)
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.8,
        metalness: 0.1
    }), // Top face (positive Y)
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.8,
        metalness: 0.1
    }), // Bottom face (negative Y)
    new MeshStandardMaterial({ 
        color:     whiteColor,
        roughness: 0.4,
        metalness: 0.5
    }), // Front face (positive Z)
    new MeshStandardMaterial({ 
        color:     '#111',
        roughness: 0.4,
        metalness: 0.1
    })  // Back face (negative Z)
]

const Page = ({ number, front, back, ...props }) => {
    const group          = useRef()
    const skinnedMeshRef = useRef()

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
        const materials    = pageMaterials
        const mesh         = new SkinnedMesh(pageGeometry, materials)
        mesh.castShadow    = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0]) // Add the first bone to the mesh!
        mesh.bind(skeleton)

        return mesh;
    }, [])

    return (
        <group {...props} ref = {group}>
            <primitive 
            object = {manualSkinnedMesh} 
            ref    = {skinnedMeshRef}
            />
        </group>
    );
}

const Book = ({ ...props }) => {
    return (
        <group {...props}>
            {[...pages].map((pageData, index) => (
                <Page
                key        = {index}
                position-x = {index * 0.15}
                number     = {index}
                {...pageData}
                />
            ))}
        </group>
    );
}

export default Book;
