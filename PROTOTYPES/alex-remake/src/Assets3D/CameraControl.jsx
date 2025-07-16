import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { easing } from 'maath'

const minZPosition = Math.ceil(150 / 3) // Minimum Z position limit
const maxZPosition = Math.ceil(150 / 2) // Maximum Z position limit

const CustomScrollZoom = () => {
	const { camera, gl }    = useThree()
	// useRef is used to keep the camera position reference stable across renders
	const cameraPositionRef = useRef(camera.position.clone())

	useEffect(() => {
		const handleWheel = (e) => {
			e.preventDefault()
			const zoomSpeed = 0.3
			const pos       = cameraPositionRef.current
			const zDelta    = e.deltaY * 0.01 * zoomSpeed

			const temp = pos.z + zDelta
			if (minZPosition < temp && temp < maxZPosition) // Εδώ θα πρέπει να μπούνε τα όρια του Config!!!
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

export default CustomScrollZoom;
