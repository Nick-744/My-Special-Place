import { timestamps, panelsOpacityEventHovering } from '../MyConfig'
import { useRef, useLayoutEffect, useState, useEffect, useContext } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { calculateEventZPosition } from '../Helpers/Utils'
import { Box, Typography, Paper } from '@mui/material'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`
	if (year > 0) return `${year} μ.Χ.`
	return '0'
}

const Timestamps2DMobile = ({ cameraZPositionState, setCameraZPositionState }) => {
	const sorted = [...timestamps].sort((a, b) => a - b)
	const globalVar = useContext(globalVarContext)
	
	const contentRef = useRef(null)
	const scrollContainerRef = useRef(null)
	const [contentWidth, setContentWidth] = useState(0)
	const [selectorLeft, setSelectorLeft] = useState(0)
	
	const FOVconstant = 9.0

	// Calculate content width on mount
	useLayoutEffect(() => {
		if (contentRef.current) {
			setContentWidth(contentRef.current.scrollWidth)
		}
	}, [])

	// Update selector position based on camera - EXACTLY like original arrow logic
	useEffect(() => {
		let closestIndex = 0
		
		timestamps.forEach((year, index) => {
			const difference = Math.abs(cameraZPositionState - calculateEventZPosition(year))
			if (difference > FOVconstant) return
			closestIndex = index
		})

		// Each label takes up contentWidth / timestamps.length space
		const labelWidth = contentWidth / timestamps.length
		// Position selector at center of corresponding label
		const selectorPosition = closestIndex * labelWidth + (labelWidth / 2) - 50 // -50 for half selector width
		
		setSelectorLeft(selectorPosition)
	}, [cameraZPositionState, contentWidth])

	// Handle timestamp click - EXACTLY like original
	const handleTimestampClick = (year) => {
		const targetZPosition = calculateEventZPosition(year)
		setCameraZPositionState(targetZPosition + FOVconstant - 0.1)
	}

	return (
		<Box
			sx={{
				position: 'absolute',
				bottom: '30px',
				left: '50%',
				transform: 'translateX(-50%)',
				width: '85%',
				maxWidth: '600px',
				height: '80px',
				zIndex: 1000,
			}}
		>
			<Paper
				ref={scrollContainerRef}
				elevation={4}
				sx={{
					width: '100%',
					height: '100%',
					backgroundColor: '#fafafa',
					borderRadius: 3,
					display: 'flex',
					alignItems: 'center',
					zIndex: 1000,
					userSelect: 'none',
					pointerEvents: 'auto',
					overflowX: 'scroll',
					overflowY: 'hidden',
					opacity: globalVar.panelsVisibility ? 1 : panelsOpacityEventHovering,
					transition: 'all 0.3s ease',
					'&:hover': { transform: 'scale(1.025)' },
					'&::-webkit-scrollbar': {
						height: '3px',
					},
					'&::-webkit-scrollbar-track': {
						backgroundColor: 'transparent',
					},
					'&::-webkit-scrollbar-thumb': {
						backgroundColor: 'rgba(0, 170, 255, 0.3)',
						borderRadius: '3px',
					},
				}}
			>
				{/* Selector box - moves like the original arrow */}
				<Box
					sx={{
						position: 'absolute',
						left: `${selectorLeft}px`,
						top: '50%',
						transform: 'translateY(-50%)',
						width: '100px',
						height: '50px',
						border: '2px solid #00aaff',
						borderRadius: '12px',
						backgroundColor: 'rgba(0, 170, 255, 0.1)',
						zIndex: 2,
						pointerEvents: 'none',
						transition: 'left 0.1s ease-out', // Same transition as original arrow
						boxShadow: '0 0 15px rgba(0, 170, 255, 0.3)',
					}}
				/>

				<Box
					ref={contentRef}
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 4,
						paddingX: 2,
						minWidth: 'max-content',
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
							<Typography
								key={index}
								variant="body2"
								onClick={() => handleTimestampClick(year)}
								sx={{
									textAlign: 'center',
									fontSize: isSelected ? '18px' : '14px',
									color: isSelected ? '#00aaff' : '#333',
									fontWeight: isSelected ? 700 : 400,
									minWidth: '80px',
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									'&:hover': {
										backgroundColor: '#e3f2fd',
										color: '#00aaff',
										borderRadius: '4px',
										transform: 'scale(1.1)',
									},
									'&:active': {
										backgroundColor: '#bbdefb',
										transform: 'scale(0.9)',
									}
								}}
							>
								{formatLabel(year)}
							</Typography>
						)
					})}
				</Box>
			</Paper>
		</Box>
	)
}

export default Timestamps2DMobile;
