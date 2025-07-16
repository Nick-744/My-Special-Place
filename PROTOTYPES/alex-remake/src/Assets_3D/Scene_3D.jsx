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
			pos.z          += e.deltaY * 0.01 * zoomSpeed
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
		<div id = 'main-3d-drawing'>
			<Canvas camera = {{ fov: 60, position: [0, 0.5, Math.ceil(150/2)] }}>

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
