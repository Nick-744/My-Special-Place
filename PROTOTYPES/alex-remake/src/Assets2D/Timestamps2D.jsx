import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import { calculateEventZPosition } from '../Helpers/Utils'
import { Box, Typography, Paper } from '@mui/material'

import { timestamps } from '../MyConfig'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`;
	if (year > 0) return `${year} μ.Χ.`;

	return '0';
}

const Timestamps2D = ({ cameraZPositionState, setCameraZPositionState }) => {
	const sorted = [...timestamps].sort((a, b) => b - a)
    
    const contentRef              = useRef(null)
    const scrollContainerRef      = useRef(null)
    const [arrowTop, setArrowTop] = useState(0)

    const [contentHeight, setContentHeight] = useState(0)
	useLayoutEffect(() => {
        setContentHeight(contentRef.current.offsetHeight)

        // Scroll to the bottom on mount to align the visible
        // labels and arrow with the camera's initial Z position!
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }, [contentRef.current])

    // --- Arrow position calculation/handling ---
    const FOVconstant = 10 // This is the threshold for the arrow to appear, based on the FOV!
    useEffect(() => {
        let closestIndex = 0
        
        timestamps.forEach((year, index) => {
            const difference = Math.abs(cameraZPositionState - calculateEventZPosition(year))
            if (difference > FOVconstant) return; // The threshold 10 is based on the FOV!

            closestIndex  = index
        })

        // Each label takes up contentHeight / timestamps.length space!
        const labelHeight   = (contentHeight + 6) / timestamps.length // + 6px ( = border-radius / 2 in Paper)! 
        // Position the arrow at the vertical center of the corresponding label,
        // accounting for extra white bottom spacing in the Paper container.
        const arrowOffset   = 35
        const arrowPosition = contentHeight - (closestIndex * labelHeight) + (labelHeight / 2) - arrowOffset
        
        setArrowTop(arrowPosition)
    }, [cameraZPositionState, contentHeight])
    // contentHeight, so the arrow starts at
    // the right position when the component mounts!

    // --- Handle timestamp click ---
    const handleTimestampClick = (year) => {
        const targetZPosition = calculateEventZPosition(year)
        setCameraZPositionState(targetZPosition + FOVconstant - 0.1)
    }

	return (
		<Paper
        ref       = {scrollContainerRef}
        elevation = {4}
        sx        = {{
            position: 'absolute',
            top:      '30px',
            right:    '30px',
            width:    '130px',
            height:   '600px',

            backgroundColor: '#fafafa',
            borderRadius:    3,
            display:         'flex',
            flexDirection:   'column',
            justifyContent:  'flex-start',
            alignItems:      'center',
            zIndex:          1000,
            userSelect:      'none',
            pointerEvents:   'auto',
            overflow:        'scroll',
            overflowX:       'hidden',

            // Make the Timestamps2D component responsive [bigger]!
            transition: 'all 0.3s ease',
            '&:hover':  { transform: 'scale(1.025)' }
        }}
		>
			<Box
            ref = {contentRef}
            sx  = {{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap: 1
            }}
			>
                {/* Arrow */}
				<Box
                sx = {{
                    position:  'absolute',
                    left:      '100px',
                    top:       `${arrowTop}px`,
                    width:     0,
                    height:    0,
                    borderTop:     '10px solid transparent',
                    borderBottom:  '10px solid transparent',
                    borderRight:   '12px solid red',
                    transition:    'top 0.1s ease-out',
                    pointerEvents: 'none' // Prevent arrow from blocking clicks!
                }}
				/>
				
				{/* Labels */}
				{sorted.map((year, index) => (
					<Typography
                    key     = {index}
                    variant = "body2"
                    onClick = {() => handleTimestampClick(year)}
                    sx      = {{
                        textAlign:    'center',
                        fontSize:     '14px',
                        color:        '#333',
                        width:        '100%',
                        borderBottom: index < sorted.length - 1 ? '1px solid #b9b9b9' : 'none',
                        pb: 0.1,

                        cursor:     'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#e3f2fd',
                            color:           '#00aaff',
                            
                            borderRadius:    '4px',
                            transform:       'scale(1.3)',
                        },
                        '&:active': {
                            backgroundColor: '#bbdefb',
                            transform:       'scale(0.9)',
                        }
                    }}
					>
						{formatLabel(year)}
					</Typography>
				))}
			</Box>
		</Paper>
	);
}

export default Timestamps2D;
