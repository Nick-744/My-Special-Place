import { useRef, useLayoutEffect, useState, useContext, useEffect } from 'react'
import { timestamps, cameraInitialZ, minZPosition } from '../MyConfig'
import { globalVarContext } from '../Context/GlobalContext'
import { Box, Typography, Paper } from '@mui/material'

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

    // Normalize cameraZPos into an index within the timestamp range
    const tempMin  = minZPosition + 15 // 15px, based on the FOV of the camera!
    const clampedZ = Math.max(tempMin, Math.min(cameraInitialZ, cameraZPos))
    const t        = (clampedZ - tempMin) / (cameraInitialZ - tempMin)

    useEffect(() => { setArrowTop(t * (contentHeight - 20)) }, [cameraZPos, contentHeight])
    // - 20, because the arrow is 20px tall (10px borderTop + 10px borderBottom)

	return (
		<Paper
        elevation = {4}
        sx        = {{
            position: 'absolute',
            top:      '15%',
            right:    '100px',
            width:    '90px',
            height:   '66%',

            backgroundColor: '#fafafa',
            borderRadius:    2,
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
