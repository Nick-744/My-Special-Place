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
	const cameraPositionRef     = useRef(camera.position.clone())
	const globalContext         = useContext(globalVarContext)

	// The z coordinate of the camera is set from the global context, so
	// it can be controlled with the setCameraZPositionContext function!
	// Example: Timestamps2D.jsx file - Timestamp click handler
	cameraPositionRef.current.z = globalContext.cameraZPositionContext

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

	// Smooth animation for camera new position!
	useFrame((_, dt) => { easing.damp3(camera.position, cameraPositionRef.current, 0.5, dt) })

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
