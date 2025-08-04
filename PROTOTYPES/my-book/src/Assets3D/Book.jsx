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
    SkeletonHelper
} from 'three'
import { useMemo, useRef, useEffect } from 'react'
import { useHelper } from '@react-three/drei'
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
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: "#111"     }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor })
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
        mesh.add(skeleton.bones[0]) // Add the first bone to the mesh
        mesh.bind(skeleton)

        return mesh;
    }, [])

    // Update the ref when the mesh is created
    useEffect(() => {
        if (skinnedMeshRef.current && manualSkinnedMesh)
            skinnedMeshRef.current = manualSkinnedMesh
    }, [manualSkinnedMesh])

    useHelper(skinnedMeshRef, SkeletonHelper, 'red')

    return (
        <group {...props} ref={group}>
            <primitive 
            object = {manualSkinnedMesh} 
            ref    = {(mesh) => {
                if (mesh) skinnedMeshRef.current = mesh
            }}
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
