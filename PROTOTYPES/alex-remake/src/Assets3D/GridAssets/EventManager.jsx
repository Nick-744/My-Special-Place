import {
	eventYFloat, eventsXPosition, eventWaveEffect
} from '../../MyConfig'

import { getWaveHeight, calculateEventZPosition } from '../../Helpers/Utils'
import { getNonOverlappingX } from '../../Helpers/EventsPositioningHelp'

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
