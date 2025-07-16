import { Canvas, useFrame, useThree } from '@react-three/fiber'
import GridScenePackage from './Animated_Grid'
import { useEffect, useRef } from 'react'
import { easing } from 'maath'

const CustomScrollZoom = () => {
	const { camera, gl }    = useThree()
	// useRef is used to keep the camera position reference stable across renders
	const cameraPositionRef = useRef(camera.position.clone())

	useEffect(() => {
		const handleWheel = (e) => {
			e.preventDefault()
			const zoomSpeed = 0.5
			const pos       = cameraPositionRef.current
			const zDelta    = e.deltaY * 0.01 * zoomSpeed

			const temp = pos.z + zDelta
			if (Math.ceil(150/3) < temp && temp < Math.ceil(150/2)) // Εδώ θα πρέπει να μπούνε τα όρια του Config!!!
				pos.z += zDelta
		}

		gl.domElement.addEventListener('wheel', handleWheel)

		return () => gl.domElement.removeEventListener('wheel', handleWheel);
	}, [gl])

	useFrame((_, dt) => {
		easing.damp3(
			camera.position,
			cameraPositionRef.current,
			0.5,
			dt
		)
	})

	return null;
}

const Scene_3D = () => {
	return (
		<div
		id        = 'canvas-container'
		className = 'w3-animate-opacity'
		>
			<Canvas
			camera = {{ fov: 60, position: [0, 0.5, Math.ceil(150/2)] }}
			>

				{/* Lighting setup */}
				<ambientLight intensity = {0.5} />
				<pointLight position = {[10, 10, 10]} />

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
