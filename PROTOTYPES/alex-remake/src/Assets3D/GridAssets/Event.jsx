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
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'

// Event component using forwardRef for compatibility with refs
const Event = forwardRef(({
	eventIndex, event, position, eventsRefArray, iconsRefArray, eventIconRef
}, ref) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isClicked, setIsClicked] = useState(false)

	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)
	
	const titleRef	   = useRef()
	const eventTimeRef = useRef()
	const eventTexture = useTexture(
		'./Assets/Textures/shield_boarder_transparent.svg'
	)

	// ----- Event handlers ----- //
	const handlePointerOver = () => {
		setIsHovered(true)
		document.body.style.cursor = 'pointer'

		globalVar.setEventHoveringContext(eventIndex)
	}

	const handlePointerOut = () => {
		setIsHovered(false)
		document.body.style.cursor = 'default'

		globalVar.setEventHoveringContext(-1) // Default
	}

	const handleClick = () => { setIsClicked(!isClicked) }

	// Visual styling based on state
	const getColor = () => {
		if (isClicked) return clickedColor;
		if (isHovered) return hoveredColor;
		return originalColor;
	}

	const getScale = () => {
		if (isClicked) return 1.8;
		if (isHovered) return 1.4;
		return 1.;
	}

	useFrame((_, dt) => {
		// ----- Animate current icon (hovered or not) ----- //
		if (isHovered) {
			// Rotate the event when hovered
			eventIconRef.current.rotation.y += 2 * dt

			// So there is no over-animation of rotation
			if (eventIconRef.current.rotation.y >= Math.PI * 2)
				eventIconRef.current.rotation.y = 0
		}
		else {
			// Reset rotation smoothly when not hovered
			easing.damp3(
				eventIconRef.current.rotation,
				{ x: 0, y: Math.PI * 2, z: 0 },
				0.4,
				dt
			)
		}

		// Scale based on hover/click
		const targetScale = getScale()
		easing.damp3(
			eventIconRef.current.scale,
			{ x: targetScale, y: targetScale, z: targetScale },
			0.2,
			dt
		)
		
		// Show/Hide title and event's timestamp
		easing.damp(titleRef.current,     'fillOpacity', isHovered ? 1. : 0., 0.1, dt)
		easing.damp(eventTimeRef.current, 'fillOpacity', isHovered ? 1. : 0., 0.1, dt)

		// Control visibility based on fillOpacity for smooth fade-out
		titleRef.current.visible     = titleRef.current.fillOpacity     > 0.01
		eventTimeRef.current.visible = eventTimeRef.current.fillOpacity > 0.01



		// Adjust opacity of all events when 1 is hovered
		eventsRefArray.current.forEach((temp, i) => {
			const shouldDim     = globalVar.eventHoveringContext !== -1 && i !== globalVar.eventHoveringContext
			const targetOpacity = shouldDim ? 0.15 : 1

			easing.damp(iconsRefArray.current[i].current.material, 'opacity', targetOpacity, 4, dt)
		})
	})

	return (
		<group 
		ref      = {ref}
		position = {position}
		rotation = {[gObjRotationX, 0, 0]}
		>
			<mesh
			ref           = {eventIconRef}
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
			position = {[0, -step * 0.4, 0]}
			fontSize = {step * 0.1}
			color    = '#888888'
			anchorX  = 'center'
			anchorY  = 'bottom'
			visible  = {false}
			>
				{event.startDate < 0 
					? `${Math.abs(event.startDate)} π.Χ.`
					: `${event.startDate} μ.Χ.`}
			</Text>
		</group>
	);
})

export default Event;
