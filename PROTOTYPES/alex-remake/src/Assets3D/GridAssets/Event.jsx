import {
	step,
	cameraLooking,
	cameraFOV,
	originalColor,
	clickedColor,
	hoveredColor,
	gObjRotationX
} from '../../MyConfig'

import { forwardRef, useRef, useState, useContext } from 'react'
import { globalVarContext } from '../../Context/GlobalContext'
import { Text, useTexture } from '@react-three/drei'
import { events, useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'

// Event component using forwardRef for compatibility with refs
const Event = forwardRef(({ eventIndex, event, position, eventsRefArray }, ref) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isClicked, setIsClicked] = useState(false)

	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)
	
	const eventRef     = useRef()
	const titleRef	   = useRef()
	const eventTimeRef = useRef()
	const eventTexture = useTexture(
		'./Assets/Textures/shield_boarder_transparent.svg'
	)

	// ----- Camera ----- //
	const { camera } = useThree()

	// ----- Event handlers ----- //
	const handlePointerOver = () => {
		setIsHovered(true)
		document.body.style.cursor = 'pointer'
	}

	const handlePointerOut = () => {
		setIsHovered(false)
		document.body.style.cursor = 'default'
	}

	const handleClick = () => {
		if (isClicked) {
			camera.fov = cameraFOV
			camera.lookAt(...cameraLooking)
		}
		else {
			camera.fov = 10
			camera.lookAt(
				ref.current.position.x,
				ref.current.position.y,
				ref.current.position.z
			)
		}

		setIsClicked(!isClicked)
	}

	// Visual styling based on state
	const getColor = () => {
		if (isClicked) return clickedColor;
		if (isHovered) return hoveredColor;
		return originalColor;
	}

	const getScale = () => {
		if (isClicked) return 1.5;
		if (isHovered) return 1.2;
		return 1.;
	}

	useFrame((state, dt) => {
		if (isHovered)
		{
			// Rotate the event when hovered
			eventRef.current.rotation.y += 2 * dt

			// So there is no over-animation of rotation
			if (eventRef.current.rotation.y >= Math.PI * 2)
				eventRef.current.rotation.y = 0

			eventsRefArray.current.forEach((tempRef, index) => {
				if (index !== eventIndex) {
					tempRef.current.visible = false;
				}
			})
		}
		else
		{
			easing.damp3(
				eventRef.current.rotation,
				{ x: 0, y: Math.PI * 2, z: 0 },
				0.4,
				dt
			)

			eventsRefArray.current.forEach((tempRef, index) => {
				if (index !== eventIndex) {
					tempRef.current.visible = true;
				}
			})
		}

		easing.damp3(
			eventRef.current.scale,
			{ x: getScale(), y: getScale(), z: getScale() },
			0.2,
			dt
		)
		
		// Show/Hide title and event's timestamp
		easing.damp(titleRef.current,     'fillOpacity', isHovered ? 1. : 0., 0.2, dt)
		easing.damp(eventTimeRef.current, 'fillOpacity', isHovered ? 1. : 0., 0.2, dt)

		// Control visibility based on fillOpacity for smooth fade-out
		titleRef.current.visible     = titleRef.current.fillOpacity     > 0.01;
		eventTimeRef.current.visible = eventTimeRef.current.fillOpacity > 0.01;
	})

	return (
		<group 
		ref      = {ref}
		position = {position}
		rotation = {[gObjRotationX, 0, 0]}
		>
			<mesh
			ref           = {eventRef}
			onPointerOver = {handlePointerOver}
			onPointerOut  = {handlePointerOut}
			onClick       = {handleClick}
			>
				<planeGeometry args = {[step * 0.25, step * 0.25]} />
				<meshBasicMaterial
				map         = {eventTexture}
				side        = {THREE.DoubleSide}
				color       = {getColor()}
				transparent = {true}
				alphaTest   = {0.1}

				// visible = {globalVar.eventHoveringContext}
				/>
			</mesh>

			{/* Event title text */}
			<Text
			ref 	   = {titleRef}
			position   = {[0, +step * 0.5, 0]}
			fontSize   = {step * 0.15}
			fontWeight = {1000}
			color      = {getColor()}
			anchorX    = 'center'
			anchorY    = 'top'
			maxWidth   = {step * 3}
			visible	   = {false}
			>
				{event.title['gr']}
			</Text>

			{/* Event timestamp text */}
			<Text
			ref 	 = {eventTimeRef}
			position = {[0, -step * 0.35, 0]}
			fontSize = {step * 0.1}
			color    = '#888888'
			anchorX  = 'center'
			anchorY  = 'bottom'
			visible  = {false}
			>
				{event.startDate < 0 
					? `${Math.abs(event.startDate)} BC`
					: `${event.startDate} AD`}
			</Text>
		</group>
	);
})

export default Event;
