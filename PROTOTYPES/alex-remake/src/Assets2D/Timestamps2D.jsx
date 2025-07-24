import { useRef, useLayoutEffect, useState, useContext, useEffect } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { Box, Typography, Paper } from '@mui/material'
import { timestamps } from '../MyConfig'

import { calculateEventZPosition } from '../Helpers/Utils'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`;
	if (year > 0) return `${year} μ.Χ.`;

	return '0';
}

const Timestamps2D = () => {
	const sorted = [...timestamps].sort((a, b) => b - a)
	
    // Camera Z Position Context - Arrow movement logic
    const globalContext           = useContext(globalVarContext)
    const cameraZPos              = globalContext.cameraZPositionContext
    
    const contentRef              = useRef(null)
    const [arrowTop, setArrowTop] = useState(0)

    const [contentHeight, setContentHeight] = useState(0)
	useLayoutEffect(() => { setContentHeight(contentRef.current.offsetHeight) }, [timestamps])

    // --- Arrow position calculation/handling ---
    useEffect(() => {
        let closestIndex  = 0
        
        timestamps.forEach((year, index) => {
            const difference = Math.abs(cameraZPos - calculateEventZPosition(year))
            if (difference > 10) return; // The threshold 10 is based on the FOV!

            closestIndex  = index
        })

        // Calculate the position based on the closest timestamp
        // Each label takes up contentHeight / timestamps.length space
        const labelHeight   = contentHeight / timestamps.length
        // Position arrow at the center of the corresponding label, starting from bottom
        const arrowPosition = contentHeight - (closestIndex * labelHeight) + (labelHeight / 2) - 10 // -10 to center the 20px arrow
        
        setArrowTop(arrowPosition)
    }, [cameraZPos, contentHeight])

	return (
		<Paper
        elevation = {4}
        sx        = {{
            position: 'absolute',
            top:      '10%',
            right:    '30px',
            width:    '90px',
            height:   '75%',

            backgroundColor: '#fafafa',
            borderRadius:    3,
            boxShadow:       '0 4px 16px rgba(0, 0, 0, 0.15)',
            display:         'flex',
            justifyContent:  'center',
            alignItems:      'center',
            zIndex:          1000,
            userSelect:      'none',
            pointerEvents:   'none',
            overflow:        'hidden'
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
                    left:      '75px',
                    top:       `${arrowTop}px`,
                    width:     0,
                    height:    0,
                    borderTop:    '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderRight:  '12px solid red',
                    transition:   'top 0.1s ease-out',
                }}
				/>
				
				{/* Labels */}
				{sorted.map((year, index) => (
					<Typography
                    key     = {index}
                    variant = "body2"
                    sx      = {{
                        textAlign:    'center',
                        color:        '#333',
                        width:        '100%',
                        borderBottom: index < sorted.length - 1 ? '1px solid #e0e0e0' : 'none',
                        pb: 0.5,
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
