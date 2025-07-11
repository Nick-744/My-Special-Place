import { globalVarContext } from '../Context/GlobalContext'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useContext } from 'react'
import { easing } from 'maath'

const Rig = (props) => {
  const groupRef = useRef()
  const scroll   = useScroll()

  // ----- Global ----- //
  const globalVar           = useContext(globalVarContext)
  globalVar.globalGroupRef  = groupRef

  useFrame((state, dt) => {
    groupRef.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move

    if (globalVar.rigCameraActive) return; // Testing όχι κίνηση στον θόλο!
    
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 11],
      0.4,
      dt
    ) // Move camera - Αρχική θέση: [0, 1.5, 10]
    state.camera.lookAt(0, 0, 0) // Look at center
  })

  return (<group ref = {groupRef} {...props} />);
}

export default Rig;
