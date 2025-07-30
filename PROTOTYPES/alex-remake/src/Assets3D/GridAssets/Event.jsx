import { step, originalColor, hoveredColor, gObjRotationX, textColor } from '../../MyConfig'

import { forwardRef, useRef, useState, useContext } from 'react'
import { globalVarContext } from '../../Context/GlobalContext'
import { Text, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'

const Event = forwardRef(({
	eventIndex, event, position, iconsRefArray, eventIconRef
}, ref) => {
	const [isHovered, setIsHovered] = useState(false)

	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)
	
	const titleRef	       = useRef()
	const eventTimeRef     = useRef()
	const eventLocationRef = useRef()

	const eventTexture = useTexture(
		'./Assets/Textures/shield_boarder_transparent.svg'
	)

	// ----- Event handlers ----- //
	const handlePointerOver = () => {
		setIsHovered(true)
		document.body.style.cursor = 'pointer'

		globalVar.setEventHoveringContext(eventIndex)
		globalVar.setPanelsVisibility(false)
	}

	const handlePointerOut = () => {
		setIsHovered(false)
		document.body.style.cursor = 'default'

		globalVar.setEventHoveringContext(-1) // Default
		globalVar.setPanelsVisibility(true)
	}

	/* --- Open modal with event details --- */
	const handleClick = () => {
		globalVar.setSelectedEventContext(event)
		globalVar.setIsModalOpenContext(!globalVar.isModalOpenContext)
	}

	// Visual styling based on state
	const getColor = () => {
		if (isHovered) return hoveredColor;

		return originalColor[event.section];
	}

	const getScale = () => {
		if (isHovered) return 1.5;
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

		// Scale based on hover
		const targetScale = getScale()
		easing.damp3(
			eventIconRef.current.scale,
			{ x: targetScale, y: targetScale, z: targetScale },
			0.1,
			dt
		)
		
		// Show/Hide title and event's timestamp
		easing.damp(titleRef.current,         'fillOpacity', isHovered ? 1. : 0., 0.1, dt)
		easing.damp(eventTimeRef.current,     'fillOpacity', isHovered ? 1. : 0., 0.1, dt)
		easing.damp(eventLocationRef.current, 'fillOpacity', isHovered ? 1. : 0., 0.1, dt)

		// Control visibility based on fillOpacity for smooth fade-out
		titleRef.current.visible         = titleRef.current.fillOpacity         > 0.01
		eventTimeRef.current.visible     = eventTimeRef.current.fillOpacity     > 0.01
		eventLocationRef.current.visible = eventLocationRef.current.fillOpacity > 0.01

		iconsRefArray.current.forEach((tempRef, i) => {
			// Adjust opacity of all events when 1 is hovered
			const shouldDim     = globalVar.eventHoveringContext !== -1 && i !== globalVar.eventHoveringContext
			let   targetOpacity = shouldDim ? 0.15 : 1

			// === SPECIAL WAY === //
			let   eventMobileFlag = false
			const temp = (tempRef.current.material.color.r === tempRef.current.material.color.b &&
						  tempRef.current.material.color.g === tempRef.current.material.color.b)
			if (temp) {
				targetOpacity   = 0.12
				eventMobileFlag = globalVar.mobileViewContext && temp
			}

			// Smoothly adjust opacity of events that are not
			// enabled - Section & Type filters! // === SPECIAL WAY === //
			easing.damp(tempRef.current.material, 'opacity', targetOpacity, 4, dt)
			
			// Mobileview out of view events positioning handling // === SPECIAL WAY === //
			easing.damp(tempRef.current.position, 'y', !eventMobileFlag ? 0 : 12, 12, dt)
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
			position   = {[0, +step * 0.6, 0]}
			fontSize   = {step * 0.18}
			fontWeight = {1000}
			color      = {getColor()}
			anchorX    = 'center'
			anchorY    = 'top'
			maxWidth   = {step * 3.5}
			visible	   = {false}
			>
				{event.title['gr']}
			</Text>

			{/* Event timestamp text */}
			<Text
			ref 	 = {eventTimeRef}
			position = {[0, -step * 0.5, 0]}
			fontSize = {step * 0.12}
			color    = {textColor}
			anchorX  = 'center'
			anchorY  = 'bottom'
			visible  = {false}
			>
				{event.startDate < 0 
					? `${Math.abs(event.startDate)} π.Χ.`
					: `${event.startDate} μ.Χ.`}
			</Text>

			{/* Event location text */}
			<Text
			ref 	 = {eventLocationRef}
			position = {[0, -step * 0.65, 0]}
			fontSize = {step * 0.12}
			color    = {textColor}
			anchorX  = 'center'
			anchorY  = 'bottom'
			visible  = {false}
			>
				{event.location['gr'] || 'Άγνωστο'}
			</Text>
		</group>
	);
})

export default Event;
