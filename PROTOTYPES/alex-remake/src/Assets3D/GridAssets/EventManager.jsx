import {
	step, eventYFloat, eventsXPosition, eventWaveEffect
} from '../../MyConfig'

import {
	getWaveHeight,
	calculateDistanceFromCamera,
	calculateEventZPosition
} from '../../Utils'
import { eventsData } from '../../InfoData/EventsData'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import Event from './Event'

const EventManager = () => {
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

	// ----- Positioning Logic/Pattern ----- //
	const Z_BUCKET_SIZE = step * 3
	function getZBucket(z) { return Math.round(z / Z_BUCKET_SIZE) * Z_BUCKET_SIZE; }

	const usedXPerZ = new Map()
	function getNonOverlappingX(z, baseX, buffer = step * 0.6, maxAttempts = 20) {
		const bucketZ = getZBucket(z)
		if (!usedXPerZ.has(bucketZ)) usedXPerZ.set(bucketZ, [])
		const usedX   = usedXPerZ.get(bucketZ)

		// Try spreading X left and right from baseX in a predictable pattern
		for (let i = 0; i < maxAttempts; i++) {
			const offset = ((i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2)) * buffer
			const tryX   = baseX + offset

			const collides = usedX.some(x => Math.abs(x - tryX) < buffer)
			if (!collides) {
				usedX.push(tryX)

				return tryX;
			}
		}

		// Fallback: add random jitter if no spot found after all attempts
		const fallbackX = baseX + (Math.random() - 0.5) * buffer
		usedX.push(fallbackX)

		return fallbackX;
	}

	// Calculate position for each event based on timestamp
	function calculateEventPosition(event, _) {
		// Position based on the event's timestamp value
		const z = calculateEventZPosition(event.startDate)
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
