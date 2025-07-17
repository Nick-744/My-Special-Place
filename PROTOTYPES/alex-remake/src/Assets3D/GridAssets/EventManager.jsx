import {
	timestamps, step, minZPosition, maxZPosition, eventsXPosition
} from '../../MyConfig'

import { getWaveHeight, calculateDistanceFromCamera } from '../../Utils'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import Event from './Event'

// Sample events data - replace with your actual events
const sampleEvents = [
	{ id: 1, timestamp: 5, title: "Ancient Event", section: "history" },
	{ id: 2, timestamp: 12, title: "Historical Event", section: "culture" },
	{ id: 3, timestamp: 20, title: "Medieval Event", section: "politics" },
	{ id: 4, timestamp: 30, title: "Renaissance Event", section: "art" },
	{ id: 5, timestamp: 50, title: "Modern Event", section: "technology" }
]

const EventManager = () => {
	// Calculate the range of timestamps for positioning
	const minTimestamp = Math.min(...timestamps)
	const maxTimestamp = Math.max(...timestamps)
	const timestampRange = maxTimestamp - minTimestamp

	// Create an array of refs, one for each event
	const eventRefs = useRef(sampleEvents.map(() => React.createRef()))

	// Animation loop - update event positions with wave effect
	useFrame((state) => {
		const time = state.clock.elapsedTime
		eventRefs.current.forEach((ref, index) => {
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
				ref.current.position.y = waveHeight + 0.2 // Offset above wave
			}
		})
	})

	// Calculate position for each event based on timestamp
	function calculateEventPosition(event, index) {
		// Position based on the event's timestamp value
		const normalizedPosition = (event.timestamp - minTimestamp) / timestampRange
		const z = maxZPosition - normalizedPosition * (maxZPosition - minZPosition)
		
		// X position with slight offset for each event
		const x = step * eventsXPosition + (index * 0.2)
		
		// Y will be updated by wave animation
		const y = 0.5
		
		return [x, y, z]
	}

	// Create individual event components
	function createEvent(event, index) {
		const position = calculateEventPosition(event, index)
		
		return (
			<Event
				ref={eventRefs.current[index]}
				key={event.id}
				index={index}
				event={event}
				position={position}
			/>
		)
	}

	return sampleEvents.map((event, index) => createEvent(event, index))
}

export default EventManager
