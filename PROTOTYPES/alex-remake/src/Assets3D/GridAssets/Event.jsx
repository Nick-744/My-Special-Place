import { forwardRef, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { step } from '../../MyConfig'
import { easing } from 'maath'

// Event component using forwardRef for compatibility with refs
const Event = forwardRef(({ _, event, position }, ref) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isClicked, setIsClicked] = useState(false)
	const boxRef = useRef()

	// Event handlers
	const handlePointerOver = () => {
		setIsHovered(true)
		document.body.style.cursor = 'pointer'
	}

	const handlePointerOut = () => {
		setIsHovered(false)
		document.body.style.cursor = 'default'
	}

	const handleClick = () => { setIsClicked(!isClicked) }

	// Visual styling based on state
	const getColor = () => {
		if (isClicked) return '#800080';
		if (isHovered) return '#009c41';
		return '#ff0000';
	}

	const getScale = () => {
		if (isClicked) return 1.5;
		if (isHovered) return 1.2;
		return 1.0;
	}

	useFrame((_, dt) => {
		if (isHovered) {
			// Rotate the box when hovered
			boxRef.current.rotation.y += 2 * dt

			// So there is no over-animation of rotation
			if (boxRef.current.rotation.y >= Math.PI * 2)
				boxRef.current.rotation.y = 0
		}
		else
			easing.damp3(
				boxRef.current.rotation,
				{ x: 0, y: 0, z: 0 },
				0.4,
				dt
			)
		
		easing.damp3(
			boxRef.current.scale,
			{ x: getScale(), y: getScale(), z: getScale() },
			0.2,
			dt
		)
	})

	return (
		<group 
		ref      = {ref}
		position = {position}
		scale    = {[getScale(), getScale(), getScale()]}
		>
			<mesh
			ref           = {boxRef}
			onPointerOver = {handlePointerOver}
			onPointerOut  = {handlePointerOut}
			onClick       = {handleClick}
			>
				<boxGeometry args = {[step * 0.2, step * 0.2, step * 0.2]} />
				<meshBasicMaterial color = {getColor()} />
			</mesh>

			{/* Event title text */}
			<Text
			position = {[0, step * 0.2, 0]}
			fontSize = {step * 0.1}
			color    = {getColor()}
			anchorX  = 'center'
			anchorY  = 'bottom'
			maxWidth = {step * 2}
			>
				{event.title}
			</Text>

			{/* Event timestamp text */}
			<Text
			position = {[0, -step * 0.15, 0]}
			fontSize = {step * 0.06}
			color    = '#888888'
			anchorX  = 'center'
			anchorY  = 'top'
			>
				{event.timestamp < 0 
					? `${Math.abs(event.timestamp)} BC`
					: `${event.timestamp} AD`}
			</Text>
		</group>
	);
})

export default Event;
