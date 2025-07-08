import { CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import GenerateGalaxy from './GenGalaxy';

const App = () => {
  const cameraRef = useRef()
  const galaxyRef = useRef()

  useEffect(() => {
    cameraRef.current.setLookAt(
      0, 6, 8,
      0, 0, 0,
      true
    )
  }, [])

  useFrame((_, dt) => {
    galaxyRef.current.rotation.y += dt * 0.04
  })

  return (
    <>
      <CameraControls ref = {cameraRef}/>

      <mesh ref = {galaxyRef}>
        <GenerateGalaxy />
      </mesh>
    </>
  );
}

export default App;
