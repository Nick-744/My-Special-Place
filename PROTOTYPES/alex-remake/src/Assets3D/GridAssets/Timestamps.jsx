import {
	timestamps, step, minZPosition, maxZPosition, timestampsXPosition
} from '../../MyConfig'

import { getWaveHeight, calculateDistanceFromCamera } from '../../Utils'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import React, { useRef } from 'react'
import * as THREE from 'three'

const Timestamps = () => {
	// Calculate the range of timestamps for scaling
	const minTimestamp   = Math.min(...timestamps)
	const maxTimestamp   = Math.max(...timestamps)
	const timestampRange = maxTimestamp - minTimestamp

	// Create an array of refs, 1 for each timestamp
	const timestampRefs = useRef(timestamps.map(() => React.createRef()))

	useFrame((state) => {
		const time = state.clock.elapsedTime
		timestampRefs.current.forEach((ref, _) => {
			if (ref.current) {
				const distanceFromCamera = calculateDistanceFromCamera(
					ref.current.position.x, ref.current.position.z
				)
				const waveHeight = getWaveHeight(
					ref.current.position.x,
					ref.current.position.z,
					time,
					distanceFromCamera
				)
				ref.current.position.y = waveHeight
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
		const x = step * timestampsXPosition + 0.1
		const y = 0.1
		
		// Rotate to face the camera
		const rotation = new THREE.Euler(0, 0, 0, 'XYZ')

		return (
			<Text
			ref      = {timestampRefs.current[index]}
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
