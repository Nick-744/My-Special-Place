import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Αυτά εδώ επίσης πάνε για το Config file...
const minZPosition = Math.ceil(150 / 3)
const maxZPosition = Math.ceil(150 / 2) - 2.5
const timestampsXPosition = 2 // Integer value!

const Timestamps = () => {
	// Mock data for testing
	const timestamps = [0, 5, 10, 12, 20, 30, 50]

	// Grid configuration to match AnimatedGrid
	const gridSize      = 150
	const gridDivisions = 180
	const gridStep      = gridSize / gridDivisions

	// Calculate the range of timestamps for scaling
	const minTimestamp   = Math.min(...timestamps)
	const maxTimestamp   = Math.max(...timestamps)
	const timestampRange = maxTimestamp - minTimestamp

	function createDateLabel(index) {
		const timestamp = timestamps[index]
		
		// Simplified label formatting
		const label = timestamp < 0 
		? `${Math.abs(timestamp)} B.C`
		: `${Math.abs(timestamp)} A.D`

		// Position based on the actual timestamp value
		const normalizedPosition = (timestamp - minTimestamp) / timestampRange
		const z = maxZPosition - normalizedPosition * (maxZPosition - minZPosition)
		
		const x = gridStep * timestampsXPosition
		const y = 0.1
		
		// Rotate to face the camera (accounting for grid rotation)
		const rotation = new THREE.Euler(0, 0, 0, 'XYZ')

		return (
			<Text
			key      = {index}
			position = {[x, y, z]}
			fontSize = {gridStep * 0.2}
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
