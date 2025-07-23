import {
	timestamps, step, timestampsXPosition, gObjRotationX, eventWaveEffect
} from '../../MyConfig'

import { getWaveHeight, calculateEventZPosition } from '../../Helpers/Utils'

import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import React, { useRef } from 'react'
import * as THREE from 'three'

const Timestamps = () => {
	// Create an array of refs, 1 for each timestamp
	const timestampRefs     = useRef(timestamps.map(() => React.createRef()))
	const timestampsYHeight = 0.1

	// Animation loop - Update positions with wave effect
	useFrame((state) => {
		const time = state.clock.elapsedTime
		timestampRefs.current.forEach((ref, _) => {
			if (ref.current) {
				const waveHeight = getWaveHeight(
					ref.current.position.x,
					ref.current.position.z,
					time
				)
				ref.current.position.y = waveHeight * eventWaveEffect + timestampsYHeight
			}
		})
	})

	function createDateLabel(index) {
		const timestamp = timestamps[index]
		
		// Simplified label formatting
		const label = timestamp < 0 
		? `${Math.abs(timestamp)} π.Χ.`
		: `${timestamp} μ.Χ.`

		// Position based on the actual timestamp value
		const z = calculateEventZPosition(timestamp)
		const x = step * timestampsXPosition + 0.1
		const y = timestampsYHeight
		
		// Rotate to face the camera
		const rotation = new THREE.Euler(gObjRotationX, 0, 0, 'XYZ')

		return (
			<Text
			ref      = {timestampRefs.current[index]}
			key      = {index}
			position = {[x, y, z]}
			fontSize = {step * 0.2}
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
