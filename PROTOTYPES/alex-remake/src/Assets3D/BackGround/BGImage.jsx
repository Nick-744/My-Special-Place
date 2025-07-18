import { useTexture } from '@react-three/drei'
import { size } from '../../MyConfig'
import * as THREE from 'three';

const BGImage = () => {
    const cylinderHeight = size / 3
    const bgTexture      = useTexture(
        './Assets/ImageData/aleksander_background.png'
    )

    return (
        <mesh position = {[0, cylinderHeight / 2, 0]}>
            <cylinderGeometry args = {[size / 6, size / 2, cylinderHeight, 64, 64, true]} />
            {/* radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}

            <meshBasicMaterial
            map  = {bgTexture}
            side = {THREE.BackSide}
            />
        </mesh>
    );
}

export default BGImage;
