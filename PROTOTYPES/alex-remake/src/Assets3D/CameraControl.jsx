import { 
	minZPosition, cameraInitialZ, cameraLooking, cameraZoomSpeed
} from '../MyConfig'

import { globalVarContext } from '../Context/GlobalContext'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useContext } from 'react'
import { easing } from 'maath'

const CustomScrollZoom = () => {
	const { camera, gl }    = useThree()
	// useRef is used to keep the camera position reference stable across renders
	const cameraPositionRef = useRef(camera.position.clone())
	const globalContext     = useContext(globalVarContext)

	useEffect(() => {
		const handleWheel = (e) => {
			e.preventDefault()
			const zoomSpeed = cameraZoomSpeed
			const pos       = cameraPositionRef.current
			const zDelta    = e.deltaY * 0.01 * zoomSpeed

			const temp = pos.z + zDelta
			if (minZPosition <= temp && temp <= cameraInitialZ)
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

		// Update the camera Z position reference,
		// so it can be used in [X] component!
		globalContext.setCameraZPositionContext(camera.position.z)
	})

	return null;
}

const SceneCameraLookAt = () => {
	const { camera } = useThree()

	useEffect(() => {
		camera.lookAt(
			cameraLooking[0],
			cameraLooking[1],
			cameraLooking[2]
		)
	}, [])

	return null;
}

const Camera3D = () => {
	return (
		<>
			<CustomScrollZoom />
			<SceneCameraLookAt />
		</>
	);
}

export default Camera3D;
