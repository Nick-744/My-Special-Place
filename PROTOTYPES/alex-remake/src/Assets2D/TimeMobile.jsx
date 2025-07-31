import { timestamps, panelsOpacityEventHovering } from '../MyConfig'

import { useRef, useLayoutEffect, useState, useEffect, useContext } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { calculateEventZPosition } from '../Helpers/Utils'
import { Box, Typography, Paper } from '@mui/material'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`
	if (year > 0) return `${year} μ.Χ.`

	return '0';
}

const Timestamps2DMobile = ({ cameraZPositionState, setCameraZPositionState }) => {
	const sorted = [...timestamps].sort((a, b) => a - b)

	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)
	
	const contentRef           = useRef(null)
	const scrollContainerRef   = useRef(null)
	const scrollTimeoutRef     = useRef(null)
	const lastCenteredIndexRef = useRef(-1)
	const [contentWidth, setContentWidth] = useState(0)
	const [selectorLeft, setSelectorLeft] = useState(0)
	
	const FOVconstant = 10.8

	// Calculate content width on mount
	useLayoutEffect(() => { if (contentRef.current) setContentWidth(contentRef.current.scrollWidth) }, [])

	// Update selector position and auto-scroll to keep it centered
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
		
		setSelectorLeft(selectorPosition)

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

	// Handle scroll events to snap to closest label!
	useEffect(() => {
		const handleScroll = () => {
			if (!scrollContainerRef.current || !contentRef.current) return;

			// Clear any previous snap timeout
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

			const container       = scrollContainerRef.current
			const labels          = Array.from(contentRef.current.children)
			const containerCenter = container.scrollLeft + container.offsetWidth / 2

			let closest = { index: 0, distance: Infinity }

			labels.forEach((labelEl, index) => {
				const labelCenter = labelEl.offsetLeft + labelEl.offsetWidth / 2
				const distance    = Math.abs(containerCenter - labelCenter)
				if (distance < closest.distance) closest = { index, distance }
			})

			const newCenteredIndex = closest.index

			// Only update if index actually changed
			if (lastCenteredIndexRef.current !== newCenteredIndex) {
				lastCenteredIndexRef.current = newCenteredIndex

				const centeredYear = sorted[newCenteredIndex]
				const newZ         = calculateEventZPosition(centeredYear)

				setCameraZPositionState(newZ + FOVconstant - 0.1)
			}

			// Debounced snap to center after user stops scrolling
			scrollTimeoutRef.current = setTimeout(() => {
				const targetLabel = labels[closest.index]
				if (!targetLabel) return;

				const targetCenter = targetLabel.offsetLeft + targetLabel.offsetWidth / 2
				const scrollTo     = targetCenter - container.offsetWidth / 2

				container.scrollTo({ left: scrollTo, behavior: 'smooth' })
			}, 150) // Snap Xms after last scroll
		}

		const ref = scrollContainerRef.current
		if (ref) ref.addEventListener('scroll', handleScroll, { passive: true })

		return () => {
			if (ref)                      ref.removeEventListener('scroll', handleScroll)
			if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
		};
	}, [sorted, contentRef.current])

	// Handle timestamp click
	const handleTimestampClick = (year) => {
		const targetZPosition = calculateEventZPosition(year)
		setCameraZPositionState(targetZPosition + FOVconstant - 0.1)
	}

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
			zIndex:    1000,
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
				},
			}}
			>
				<Box
				ref = {contentRef}
				sx  = {{
					display:    'flex',
					alignItems: 'center',
					gap:        4,
					paddingX:   2,
					paddingX:   '50px', // So the first and last labels can be selected!
					minWidth:   'max-content'
				}}
				>
					{sorted.map((year, index) => {
						// Simple distance calculation for visual effects
						let closestIndex = 0
						timestamps.forEach((y, i) => {
							const diff = Math.abs(cameraZPositionState - calculateEventZPosition(y))
							if (diff <= FOVconstant) closestIndex = i
						})
						
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
								// onClick = {() => handleTimestampClick(year)}
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
