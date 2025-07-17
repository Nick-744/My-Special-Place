import {
	timestamps, step, minZPosition, maxZPosition, timestampsXPosition
} from '../../MyConfig'

import { getWaveHeight, calculateDistanceFromCamera } from '../../Utils'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

const Timestamps = () => {
	// Calculate the range of timestamps for scaling
	const minTimestamp   = Math.min(...timestamps)
	const maxTimestamp   = Math.max(...timestamps)
	const timestampRange = maxTimestamp - minTimestamp

	useFrame((state) => {
		const time = state.clock.elapsedTime

		// Update text positions based on wave height
		state.scene.traverse((child) => {
			if (child.isMesh && child.userData.isTimestampLabel) {
				const x = child.position.x
				const z = child.position.z

				const distanceFromCamera = calculateDistanceFromCamera(x, y);
				const y = 0.1 + getWaveHeight(x, z, time, distanceFromCamera)

				child.position.set(x, y, z)
			}
		})
	})

	function createDateLabel(index) {
		const timestamp = timestamps[index]
		
		// Simplified label formatting
		const label = timestamp < 0 
		? `${Math.abs(timestamp)} B.C`
		: `${Math.abs(timestamp)} A.D`

		// Position based on the actual timestamp value
		const normalizedPosition = (timestamp - minTimestamp) / timestampRange
		const z = maxZPosition - normalizedPosition * (maxZPosition - minZPosition)
		
		const x = step * timestampsXPosition
		const y = 0.1
		
		// Rotate to face the camera (accounting for grid rotation)
		const rotation = new THREE.Euler(0, 0, 0, 'XYZ')

		return (
			<Text
			key      = {index}
			position = {[x, y, z]}
			fontSize = {step * 0.2}
			// font="/OpenSans.ttf"
			rotation = {rotation}
			anchorX  = 'left'
			anchorY  = 'bottom'
			>
				{label}
			</Text>
		);
	}

	return timestamps.map((_, index) => createDateLabel(index));
}

export default Timestamps;
