import { size, cylinderHeight } from '../../MyConfig'

import { useTexture } from '@react-three/drei'
import * as THREE from 'three';

const BGImageCylinder = ({ position = [0, 0, 0] }) => {
    const bgTexture      = useTexture(
        './Assets/ImageData/aleksander_background3D.jpg'
    )

    return (
        <mesh
        position = {[
            0 + position[0],
            cylinderHeight / 2 + position[1],
            0 + position[2]
        ]}
        >
            <cylinderGeometry args = {[size / 6, size / 2, cylinderHeight, 64, 64, true]} />
            {/* radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}

            <meshBasicMaterial
            map  = {bgTexture}
            side = {THREE.BackSide}
            />
        </mesh>
    );
}

export default BGImageCylinder;
