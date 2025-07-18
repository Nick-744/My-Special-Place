import {
	timestamps, step, minZPosition, maxZPosition, eventYFloat, eventsXPosition, eventWaveEffect
} from '../../MyConfig'

import { getWaveHeight, calculateDistanceFromCamera } from '../../Utils'
import { eventsData } from '../../InfoData/EventsData'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import Event from './Event'

const EventManager = () => {
	// Calculate the range of timestamps for positioning
	const minTimestamp   = Math.min(...timestamps)
	const maxTimestamp   = Math.max(...timestamps)
	const timestampRange = maxTimestamp - minTimestamp

	// Create an array of refs, 1 for each event
	const eventRefs = useRef(eventsData.map(() => React.createRef()))

	// Animation loop - update event positions with wave effect
	useFrame((state) => {
		const time = state.clock.elapsedTime
		eventRefs.current.forEach((ref, _) => {
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
				ref.current.position.y = waveHeight * eventWaveEffect + eventYFloat
			}
		})
	})

	// Calculate position for each event based on timestamp
	function calculateEventPosition(event, index) {
		// Position based on the event's timestamp value
		const normalizedPosition = (event.timestamp - minTimestamp) / timestampRange
		const z = maxZPosition - normalizedPosition * (maxZPosition - minZPosition)
		const x = step * eventsXPosition + (index * 0.2)
		const y = 0 // Y will be updated by wave animation
		
		return [x, y, z];
	}

	// Create individual event components
	function createEvent(event, index) {
		const position = calculateEventPosition(event, index)
		
		return (
			<Event
				ref      = {eventRefs.current[index]}
				key      = {event.ID}
				index    = {index}
				event    = {event}
				position = {position}
			/>
		);
	}

	return eventsData.map((event, index) => createEvent(event, index));
}

export default EventManager;
