import {
	step
} from '../../MyConfig'

import React, { forwardRef, useState } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Event component using forwardRef for compatibility with refs
const Event = forwardRef(({ index, event, position }, ref) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isClicked, setIsClicked] = useState(false)

	// Event handlers
	const handlePointerOver = () => {
		setIsHovered(true)
		document.body.style.cursor = 'pointer'
	}

	const handlePointerOut = () => {
		setIsHovered(false)
		document.body.style.cursor = 'default'
	}

	const handleClick = () => {
		setIsClicked(!isClicked)
		console.log(`Event clicked: ${event.title}`)
	}

	// Visual styling based on state
	const getColor = () => {
		if (isClicked) return '#ff6b6b'
		if (isHovered) return '#4ecdc4'
		return '#45b7d1'
	}

	const getScale = () => {
		if (isClicked) return 1.5
		if (isHovered) return 1.2
		return 1.0
	}

	return (
		<group 
			ref={ref}
			position={position}
			scale={[getScale(), getScale(), getScale()]}
		>
			{/* Event marker sphere */}
			<mesh
				onPointerOver={handlePointerOver}
				onPointerOut={handlePointerOut}
				onClick={handleClick}
			>
				<sphereGeometry args={[step * 0.1, 16, 16]} />
				<meshBasicMaterial color={getColor()} />
			</mesh>

			{/* Event title text */}
			<Text
				position={[0, step * 0.2, 0]}
				fontSize={step * 0.08}
				color={getColor()}
				anchorX="center"
				anchorY="bottom"
				maxWidth={step * 2}
			>
				{event.title}
			</Text>

			{/* Event timestamp text */}
			<Text
				position={[0, -step * 0.15, 0]}
				fontSize={step * 0.06}
				color="#888888"
				anchorX="center"
				anchorY="top"
			>
				{event.timestamp < 0 
					? `${Math.abs(event.timestamp)} BC`
					: `${event.timestamp} AD`}
			</Text>
		</group>
	)
})

// Set display name for debugging
Event.displayName = 'Event'

export default Event
