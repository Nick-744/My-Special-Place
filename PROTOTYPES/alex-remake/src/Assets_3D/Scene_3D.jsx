import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import GridScenePackage from './Animated_Grid'
import { useEffect } from 'react'

const CustomScrollZoom = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      const zoomSpeed = 0.5
      camera.position.z += e.deltaY * 0.01 * zoomSpeed
    };

    gl.domElement.addEventListener('wheel', handleWheel)
    return () => gl.domElement.removeEventListener('wheel', handleWheel)
  }, [camera, gl])

  return null;
}

const Scene_3D = () => {
    return (
        <div id = 'main-3d-drawing'>
            <Canvas camera = {{ fov: 45, position: [0, 2, 52] }}>
              {/* Lighting setup */}
              <ambientLight intensity = {0.5} />
              <pointLight position = {[10, 10, 10]} />

              <OrbitControls
              enableZoom = {false}
              />

              <CustomScrollZoom />

              <mesh>
                  <boxGeometry />
                  <meshNormalMaterial />
              </mesh>

              <GridScenePackage />
                
            </Canvas>
        </div>
    );
}

export default Scene_3D;
