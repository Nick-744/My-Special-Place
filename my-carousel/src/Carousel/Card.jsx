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

// Single global flag for which card is active
let activeCardUUID = null

// Constants for card positioning and rotation
const CENTER     = new THREE.Vector3(0, 0, 0)
const ROT_ACTIVE = new THREE.Euler(0, 0, 0  )
const ROT_IDLE   = new THREE.Euler(0, 0, 0.1)

const Card = ({ infoDict, ...props }) => {
  // ----- Global ----- //
  const globalVar = useContext(globalVarContext)

  // ----- Cards ----- //
  const cardRef = useRef()
  const [hovered, setHovered] = useState(false)

  const originalPositionRef = useRef(null)
  useEffect(() => { originalPositionRef.current = cardRef.current.position.clone() }, [])

  // ----- Portal ----- //
  const [active, setActive] = useState(false)
  const meshPortalRef       = useRef()

  const model   = useGLTF(infoDict.modelPath)
  const texture = useTexture(infoDict.texturePath)

  useEffect(() => {
    return () => {
      if (activeCardUUID === cardRef.current?.uuid) activeCardUUID = null
    };
  }, [])

  const disabled = activeCardUUID && activeCardUUID !== cardRef.current?.uuid

  const onDoubleClick = (e) => {
    if (disabled) return;

    e.stopPropagation()
    const next = !active
    setActive(next)
    globalVar.setActiveCardView(next)
    globalVar.setRigCameraActive(next)
    activeCardUUID = next ? cardRef.current.uuid : null
  }

  const pointerOver = (e) => {
    if (disabled) return;

    e.stopPropagation()
    setHovered(true)
  }
  const pointerOut = () => {
    if (disabled) return;

    setHovered(false)
  }

  // ================== Frame ================== //
  useFrame((_, dt) => {
    // ----- Portal ----- //
    easing.damp(meshPortalRef.current, 'blend', active ? 1 : 0, 0.2, dt)

    if (originalPositionRef.current)
      easing.damp3(
        cardRef.current.position,
        active ? CENTER : originalPositionRef.current,
        0.2,
        dt
      )
    
    easing.dampE(
      globalVar.globalGroupRef.current.rotation,
      globalVar.activeCardView ? ROT_ACTIVE : ROT_IDLE,
      0.8,
      dt
    )

    // ----- Cards ----- //
    const targetScale = hovered && !disabled ? 1.15 : 1
    easing.damp3(cardRef.current.scale, targetScale, 0.15, dt)

    if (cardRef.current.material) {
      easing.damp(
        cardRef.current.material,
        'radius',
        hovered && !disabled ? 0.25 : 0.1,
        0.2,
        dt
      )
      easing.damp(
        cardRef.current.material,
        'zoom',
        hovered && !disabled ? 1 : 1.5,
        0.2,
        dt
      )
    }
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
