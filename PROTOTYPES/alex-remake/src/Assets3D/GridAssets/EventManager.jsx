import { eventYFloat, eventsXPosition, eventWaveEffect } from '../../MyConfig'

import { getWaveHeight, calculateEventZPosition } from '../../Helpers/Utils'
import { getNonOverlappingX } from '../../Helpers/EventsPositioningHelp'

import { eventsData } from '../../InfoData/EventsData'
import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import Event from './Event'

const EventManager = ({ eventRefs }) => {
	// Create an array of refs, 1 for each event
	const eventIconRefs = useRef(eventsData.map(() => React.createRef()))

	// Animation loop - update event positions with wave effect
	useFrame((state) => {
		const time = state.clock.elapsedTime
		eventRefs.current.forEach((ref, _) => {
			if (ref.current) {
				const waveHeight = getWaveHeight(
					ref.current.position.x,
					ref.current.position.z,
					time
				)
				ref.current.position.y = waveHeight * eventWaveEffect + eventYFloat
			}
		})
	})

	// Calculate position for each event based on timestamp
	const eventPositionsRef = useRef(
		// Use useRef to persist event positions across renders.
		// Without this, positions get recalculated and break due
		// to shared state in eventRefs!
		eventsData.map((event, _) => {
			// Position based on the event's timestamp value
			const z = calculateEventZPosition(event.startDate)
			const x = getNonOverlappingX(z, eventsXPosition, event.section)
			const y = 0 // Y will be updated by wave animation
			
			return [x, y, z];
		})
	)

	// Create individual event components
	function createEvent(event, index) {
		return (
			<Event
			ref        = {eventRefs.current[index]}
			key        = {event.ID}
			eventIndex = {index}
			event      = {event}
			position   = {eventPositionsRef.current[index]}

			eventsRefArray = {eventRefs}
			iconsRefArray  = {eventIconRefs}
			eventIconRef   = {eventIconRefs.current[index]}
			/>
		);
	}

	return eventsData.map((event, index) => createEvent(event, index));
}

export default EventManager;
