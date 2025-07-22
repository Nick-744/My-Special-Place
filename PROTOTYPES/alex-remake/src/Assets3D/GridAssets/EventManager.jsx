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
	const eventRefs     = useRef(eventsData.map(() => React.createRef()))
	const eventIconRefs = useRef(eventsData.map(() => React.createRef()))

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

	const usedXPerZ = new Map()
	function getNonOverlappingX(z, baseX, buffer = step * 1, jitterRange = step * 1.5) {
		let tryX
		let maxTries = 100

		if (!usedXPerZ.has(z)) usedXPerZ.set(z, [])
		const usedX = usedXPerZ.get(z)

		do {
			const jitter = (Math.random() - 0.5) * 2 * jitterRange
			tryX         = baseX + jitter

			// Only check for collisions in this Z layer
			const collides = usedX.some(
				x => Math.abs(x - tryX) < buffer
			)
			if (!collides) break;

			maxTries--;
		} while (maxTries > 0)

		usedX.push(tryX)

		return tryX;
	}

	// Calculate position for each event based on timestamp
	function calculateEventPosition(event, _) {
		// Position based on the event's timestamp value
		const normalizedPosition = (event.startDate - minTimestamp) / timestampRange
		const z = maxZPosition - normalizedPosition * (maxZPosition - minZPosition)
		const x = getNonOverlappingX(z, eventsXPosition)
		const y = 0 // Y will be updated by wave animation
		
		return [x, y, z];
	}

	// Create individual event components
	function createEvent(event, index) {
		const position = calculateEventPosition(event, index)
		
		return (
			<Event
				ref        = {eventRefs.current[index]}
				key        = {event.ID}
				eventIndex = {index}
				event      = {event}
				position   = {position}

				eventsRefArray = {eventRefs}
				iconsRefArray  = {eventIconRefs}
				eventIconRef   = {eventIconRefs.current[index]}
			/>
		);
	}

	return eventsData.map((event, index) => createEvent(event, index));
}

export default EventManager;
