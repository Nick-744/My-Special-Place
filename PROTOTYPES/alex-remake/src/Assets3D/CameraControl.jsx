import { minZPosition, cameraInitialZ, cameraLooking, cameraZoomSpeed } from '../MyConfig'

import { globalVarContext } from '../Context/GlobalContext'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useContext } from 'react'
import { easing } from 'maath'

const CustomScrollZoom = ({ cameraZPositionState, setCameraZPositionState }) => {
	const { camera, gl }    = useThree()
	// useRef is used to keep the camera position reference stable across renders
	const cameraPositionRef = useRef(camera.position.clone())

	// Touch handling refs
	const touchStartRef = useRef({ x: 0, y: 0 })
	const lastTouchRef  = useRef({ x: 0, y: 0 })

	// It has to be used and from other components!
	cameraPositionRef.current.z = cameraZPositionState

	// ----- Global / Mobile View Context ----- //
	const { mobileViewContext } = useContext(globalVarContext)

	useEffect(() => {
		if (mobileViewContext) {
			// Touch event handlers for mobile
			const handleTouchStart = (e) => {
				if (e.touches.length === 1) {
					const touch           = e.touches[0]
					touchStartRef.current = { x: touch.clientX, y: touch.clientY }
					lastTouchRef.current  = { x: touch.clientX, y: touch.clientY }
				}
			}

			const handleTouchMove = (e) => {
				e.preventDefault()
				
				if (e.touches.length === 1) {
					const touch  = e.touches[0]
					const deltaY = lastTouchRef.current.y - touch.clientY
					
					const zoomSpeed = cameraZoomSpeed * 0.03 // Adjust sensitivity for touch
					const pos       = cameraPositionRef.current
					const zDelta    = deltaY * zoomSpeed

					const temp = pos.z + zDelta
					if (minZPosition <= temp && temp <= cameraInitialZ) {
						pos.z += zDelta
						setCameraZPositionState(pos.z)
					}
					
					lastTouchRef.current = { x: touch.clientX, y: touch.clientY }
				}
			}

			const handleTouchEnd = (e) => {
				if (e.changedTouches.length === 1) {
					const touch  = e.changedTouches[0]
					const deltaX = touch.clientX - touchStartRef.current.x
					const deltaY = touch.clientY - touchStartRef.current.y
					
					// Check if it's a swipe gesture (horizontal movement > vertical movement)
					if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
						const zoomSpeed = cameraZoomSpeed * 2
						const pos       = cameraPositionRef.current
						
						// Swipe right = zoom out (increase z), swipe left = zoom in (decrease z)
						const zDelta = deltaX > 0 ? zoomSpeed : -zoomSpeed

						const temp = pos.z + zDelta
						if (minZPosition <= temp && temp <= cameraInitialZ) {
							pos.z += zDelta
							setCameraZPositionState(pos.z)
						}
					}
				}
			}

			const element = gl.domElement
			element.addEventListener('touchstart', handleTouchStart, { passive: false })
			element.addEventListener('touchmove',  handleTouchMove,  { passive: false })
			element.addEventListener('touchend',  handleTouchEnd,    { passive: false })

			return () => {
				element.removeEventListener('touchstart', handleTouchStart)
				element.removeEventListener('touchmove',  handleTouchMove)
				element.removeEventListener('touchend',   handleTouchEnd)
			}
		}
		else {
			const handleWheel = (e) => {
				e.preventDefault()
				const zoomSpeed = cameraZoomSpeed
				const pos       = cameraPositionRef.current
				const zDelta    = e.deltaY * 0.01 * zoomSpeed

				const temp = pos.z + zDelta
				if (minZPosition <= temp && temp <= cameraInitialZ) {
					pos.z += zDelta

					// Update the context with the new z position!
					setCameraZPositionState(pos.z)
				}
			}

			gl.domElement.addEventListener('wheel', handleWheel)

			return () => gl.domElement.removeEventListener('wheel', handleWheel);}
	}, [gl, setCameraZPositionState])

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

const Camera3D = ({ cameraZPositionState, setCameraZPositionState }) => {
	return (
		<>
			<CustomScrollZoom
			cameraZPositionState    = {cameraZPositionState}
			setCameraZPositionState = {setCameraZPositionState}
			/>
			<SceneCameraLookAt />
		</>
	);
}

export default Camera3D;
