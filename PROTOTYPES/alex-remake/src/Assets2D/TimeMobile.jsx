import { timestamps, panelsOpacityEventHovering } from '../MyConfig'

import { useRef, useLayoutEffect, useState, useEffect, useContext, useMemo } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { calculateEventZPosition } from '../Helpers/Utils'
import { Box, Typography, Paper } from '@mui/material'
import { eventsData } from '../InfoData/EventsData'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`;
	if (year > 0) return `${year} μ.Χ.`;

	return '0';
}

const Timestamps2DMobile = ({ cameraZPositionState, setCameraZPositionState }) => {
	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)
	const { activeFiltersContext } = globalVar

	/*  Show in the UI only the years that have events in the current section!

		The useMemo hook ensures this potentially expensive computation only runs when the
	filter criteria actually change, preventing unnecessary re-calculations on every render. */
	const currentTimestamps = useMemo(() => {
		return eventsData
			.filter(event => activeFiltersContext.section.includes(event.section))
			.map(event => event.startDate);
	}, [activeFiltersContext.section])
	const sorted = [...timestamps].sort((a, b) => a - b)
	
	const contentRef           = useRef(null)
	const scrollContainerRef   = useRef(null)
	const lastCenteredIndexRef = useRef(-1)
	const [contentWidth, setContentWidth] = useState(0)
	
	const FOVconstant = 10.8

	// Calculate content width on mount
	useLayoutEffect(() => { if (contentRef.current) setContentWidth(contentRef.current.scrollWidth) }, [])

	/* Automatic scrolling synchronization system that connects a 3D camera position to a horizontal
	timeline interface. It runs whenever the camera's Z position or the content width changes,
	creating a seamless link between 3D navigation and 2D UI elements. */
	useEffect(() => {
		let closestIndex = 0
		
		timestamps.forEach((year, index) => {
			const difference = Math.abs(cameraZPositionState - calculateEventZPosition(year))
			if (difference > FOVconstant) return;
			closestIndex = index
		})

		// Each label takes up contentWidth / timestamps.length space
		const labelWidth       = contentWidth / timestamps.length
		// Position selector at center of corresponding label
		const selectorPosition = closestIndex * labelWidth + (labelWidth / 2) - 50 // -50 for half selector width

		// Auto-scroll to keep the blue box in center of view
		if (scrollContainerRef.current && contentWidth > 0) {
			const containerWidth = scrollContainerRef.current.offsetWidth
			const selectorCenter = selectorPosition + 50 // +50 for half selector width
			const targetScroll   = selectorCenter - (containerWidth / 2)
			
			scrollContainerRef.current.scrollTo({
				left:     Math.max(0, targetScroll),
				behavior: 'smooth'
			})
		}
	}, [cameraZPositionState, contentWidth])



	/* Reverse synchronization of the timeline system - where user interactions with the 2D timeline
	control the 3D camera position. It creates a scroll event listener that translates horizontal
	scrolling into 3D camera movement, completing the bidirectional connection between the
	timeline interface and 3D navigation. */
	useEffect(() => {
		const container = scrollContainerRef.current
		const labels    = contentRef.current?.children
		if (!container || !labels?.length) return;

		let scrollStopTimeout = null
		const minYear         = Math.min(...currentTimestamps)
		const maxYear         = Math.max(...currentTimestamps)
		const handleScroll = () => {
			if (scrollStopTimeout) clearTimeout(scrollStopTimeout)

			scrollStopTimeout = setTimeout(() => {
				const containerCenter = container.scrollLeft + container.offsetWidth / 2

				let closest = { index: -1, distance: Infinity }
				Array.from(labels).forEach((labelEl, index) => {
					const labelCenter = labelEl.offsetLeft + labelEl.offsetWidth / 2
					const distance    = Math.abs(containerCenter - labelCenter)

					if (distance < closest.distance) closest = { index, distance }
				})

				let newIndex = closest.index
				if (newIndex === -1) return;

				let centeredYear = sorted[newIndex]

				/* Boundary clamping mechanism that handles situations where the user has scrolled
				to a timeline position that falls outside the valid range of available data. */
				if (centeredYear < minYear || centeredYear > maxYear) {
					// Find closest clamped year that exists in sorted[]
					let clampedYear
					if (centeredYear < minYear) clampedYear = sorted.find(y => y >= minYear)
					else                        clampedYear = [...sorted].reverse().find(y => y <= maxYear)
					
					if (clampedYear === -350) clampedYear = -360 // --- SPECIAL CASE --- //

					const newIndex = sorted.indexOf(clampedYear)
					const labelEl  = labels[newIndex]
					if (labelEl) {
						const labelCenter  = labelEl.offsetLeft + labelEl.offsetWidth / 2
						const targetScroll = labelCenter - container.offsetWidth / 2

						container.scrollTo({
							left:     Math.max(0, targetScroll),
							behavior: 'smooth'
						})
					}

					const newZ = calculateEventZPosition(clampedYear)
					setCameraZPositionState(newZ + FOVconstant - 0.1)
					lastCenteredIndexRef.current = newIndex

					return;
				}

				/*  Don't run updates unless index actually changed. In more detail:
				
					Change detection and synchronization system that only triggers UI
				updates when the user has actually moved to a different timeline position. */
				if (lastCenteredIndexRef.current !== newIndex) {
					lastCenteredIndexRef.current = newIndex

					// Snap scroll to corrected year
					const labelEl = labels[newIndex]
					if (labelEl) {
						const labelCenter  = labelEl.offsetLeft + labelEl.offsetWidth / 2
						const targetScroll = labelCenter - container.offsetWidth / 2

						container.scrollTo({
							left:     Math.max(0, targetScroll),
							behavior: 'smooth'
						})
					}

					const newZ = calculateEventZPosition(centeredYear)
					setCameraZPositionState(newZ + FOVconstant - 0.1)
				}
			}, 300)
		}

		container.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			container.removeEventListener('scroll', handleScroll)
			if (scrollStopTimeout) clearTimeout(scrollStopTimeout)
		};
	}, [currentTimestamps])



	// Animate the camera to the start position of the current active section!
	useEffect(() => {
		if (!currentTimestamps.length || !contentRef.current || !scrollContainerRef.current) return;

		const minYear   = Math.min(...currentTimestamps)
		let clampedYear = sorted.find(y => y >= minYear) || sorted[0]
		if (clampedYear === -350) clampedYear = -360 // --- SPECIAL CASE --- //

		const newIndex = sorted.indexOf(clampedYear)
		if (newIndex === -1) return;

		const labels  = contentRef.current.children
		const labelEl = labels[newIndex]
		if (!labelEl) return;

		const labelCenter    = labelEl.offsetLeft + labelEl.offsetWidth / 2
		const containerWidth = scrollContainerRef.current.offsetWidth
		const targetScroll   = labelCenter - containerWidth / 2

		scrollContainerRef.current.scrollTo({
			left:     Math.max(0, targetScroll),
			behavior: 'smooth'
		})

		const newZ = calculateEventZPosition(clampedYear)
		setCameraZPositionState(newZ + FOVconstant - 0.1)
		lastCenteredIndexRef.current = newIndex
	}, [currentTimestamps])



	/* Proximity-based selection algorithm that finds the timestamp
	closest to the current camera position in 3D space */
	let closestIndex = 0
	timestamps.forEach((y, i) => {
		const diff = Math.abs(cameraZPositionState - calculateEventZPosition(y))
		if (diff <= FOVconstant) closestIndex = i
	})



	return (
		<Box
		sx = {{
			position:  'absolute',
			bottom:    '30px',
			left:      '50%',
			transform: 'translateX(-50%)',
			width:     '85%',
			maxWidth:  '600px',
			height:    '80px',
			zIndex:    1000
		}}
		>
			<Paper
			ref       = {scrollContainerRef}
			elevation = {4}
			sx        = {{
				width:           '100%',
				height:          '100%',
				backgroundColor: '#fafafa',
				borderRadius:    3,
				display:         'flex',
				alignItems:      'center',
				zIndex:          1000,
				userSelect:      'none',
				pointerEvents:   'auto',
				overflowX:       'scroll',
				overflowY:       'hidden',
				opacity:         globalVar.panelsVisibility ? 1 : panelsOpacityEventHovering,
				transition:      'all 0.3s ease',
				'&::-webkit-scrollbar':       { height: '3px' },
				'&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: 'rgba(0, 170, 255, 0.3)',
					borderRadius:    '3px',
				}
			}}
			>
				<Box
				ref = {contentRef}
				sx  = {{
					display:    'flex',
					alignItems: 'center',
					gap:        4,
					paddingX:   '35px', // So the first and last labels can be selected!
					minWidth:   'max-content'
				}}
				>
					{sorted.map((year, index) => {
						const isSelected = index === closestIndex
						
						return (
							<Box
							key = {index}
							sx  = {{
								display:        'flex',
								alignItems:     'center',
								justifyContent: 'center',
								minWidth: '80px',
								height:   '50px',
								px: 2,
								borderRadius:    '12px',
								backgroundColor: isSelected ? 'rgba(0, 170, 255, 0.08)'         : 'transparent',
								border:          isSelected ? '2px solid #00aaff'               : 'none',
								boxShadow:       isSelected ? '0 0 10px rgba(0, 170, 255, 0.2)' : 'none',
								transition:      'all 0.2s ease'
							}}
							>
								<Typography
								key     = {index}
								variant = 'body2'
								sx      = {{
									textAlign:  'center',
									fontSize:   isSelected ? '18px' : '14px',
									color:      isSelected ? '#00aaff' : '#333',
									fontWeight: isSelected ? 700 : 400,
									minWidth:   '80px',
									cursor:     'pointer',
									transition: 'all 0.2s ease',
									'&:active': {
										backgroundColor: '#bbdefb',
										transform:       'scale(0.9)'
									}
								}}
								>
									{formatLabel(year)}
								</Typography>
							</Box>
						);
					})}
				</Box>
			</Paper>
		</Box>
	);
}

export default Timestamps2DMobile;
