import {
  Text,
  useGLTF,
  useTexture,
  MeshPortalMaterial
} from '@react-three/drei'
import { useContext, useRef, useState, useEffect } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import '../util'

const Card = ({ infoDict, ...props }) => {
  // ----- Global ----- //
  const globalVar = useContext(globalVarContext)
  
  // ----- Cards ----- //
  const cardRef = useRef()
  const [hovered, setHovered] = useState(false)

  const pointerOver = (e) => { e.stopPropagation(); setHovered(true) }
  const pointerOut  = ( ) => setHovered(false)

  const originalPositionRef = useRef(null)
  useEffect(() => { originalPositionRef.current = cardRef.current.position.clone() }, [])

  // ----- Portal ----- //
  const [active, setActive] = useState(false)
  const meshPortalRef       = useRef()

  const model   = useGLTF(infoDict.modelPath)
  const texture = useTexture(infoDict.texturePath)

  const onDoubleClick = (e) => {
    e.stopPropagation()
    setActive(!active)
    globalVar.setActiveCardView(!active)

    active ? globalVar.setRigCameraActive(false) : globalVar.setRigCameraActive(true)
  }

  // ================== Frame ================== //
  useFrame((state, dt) => {
    // ----- Portal ----- //
    easing.damp(meshPortalRef.current, 'blend', active ? 1 : 0, 0.2, dt)

    if (originalPositionRef.current)
      easing.damp3(
        cardRef.current.position,
        active ? new THREE.Vector3(0, 0, 0) : originalPositionRef.current,
        0.2,
        dt
      )
    
    easing.dampE(
      globalVar.globalGroupRef.current.rotation,
      globalVar.activeCardView ? new THREE.Euler(0, 0, 0) : new THREE.Euler(0, 0, 0.1),
      0.8,
      dt
    )

    // Για να μην μεταβάλλεται το object μέγεθος όταν είσαι στον θόλο
    if (globalVar.activeCardView) { return; }
    
    // ----- Cards ----- //
    easing.damp3(cardRef.current.scale, hovered ? 1.15 : 1, 0.1, dt)
    easing.damp(cardRef.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, dt)
    easing.damp(cardRef.current.material, 'zoom',   hovered ? 1 : 1.5,    0.2, dt)
  })

  return (
    <>
      <mesh
      ref = {cardRef}

      onDoubleClick = {onDoubleClick}
      onPointerOver = {pointerOver}
      onPointerOut  = {pointerOut}

      position      = {props.position}
      rotation      = {props.rotation}
      >
        <bentPlaneGeometry args = {[0.1, 1, 1, 20, 20]} />
        <MeshPortalMaterial
        ref  = {meshPortalRef}
        side = {THREE.DoubleSide}
        >
          <primitive
          object     = {model.scene}
          scale      = {0.2}
          position-y = {infoDict.positionY}
          rotation   = {[0, -Math.PI, 0]}
          />

          <mesh>
            <directionalLight position = {[0, 1, -3]} intensity = {1.8}/>
            <ambientLight intensity = {0.3}/>

            { /* --- Τίτλος --- */ }
            <Text
            font     = {'./fonts/bold.ttf'}
            position = {[0, 0.7, 0.1]}
            rotation = {[0, -Math.PI, 0]}
            fontSize = {0.4}
            color    = 'white'
            >
              {infoDict.title}
              <meshBasicMaterial toneMapped = {false}/>
            </Text>

            { /* --- Περιγραφή --- */ }
            <Text
            position = {[0, -0.7, -0.2]}
            rotation = {[0, -Math.PI, 0]}
            fontSize = {0.05}
            color    = 'white'
            >
              {infoDict.text}
              <meshBasicMaterial toneMapped = {false}/>
            </Text>

            <sphereGeometry args = {[5, 64, 64]}/>
            <meshBasicMaterial
            map  = {texture}
            side = {THREE.BackSide}
            />
          </mesh>
        </MeshPortalMaterial>
      </mesh>
    </>
  );
}

export default Card;
