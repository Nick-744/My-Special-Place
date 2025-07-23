import { useRef, useLayoutEffect, useState, useContext, useEffect } from 'react'
import { globalVarContext } from '../Context/GlobalContext'
import { Box, Typography, Paper } from '@mui/material'
import { timestamps } from '../MyConfig'

const formatLabel = (year) => {
	if (year < 0) return `${Math.abs(year)} π.Χ.`;
	if (year > 0) return `${year} μ.Χ.`;

	return '0';
}

const Timestamps2D = () => {
	const sorted = [...timestamps].sort((a, b) => b - a)

	const contentRef                        = useRef(null)
	const [contentHeight, setContentHeight] = useState(0)

	useLayoutEffect(() => {
		if (contentRef.current)
            setContentHeight(contentRef.current.offsetHeight)
	}, [timestamps])

    const globalContext = useContext(globalVarContext)
    useEffect(() => {
        console.log(globalContext.cameraZPositionContext)
    }, [globalContext.cameraZPositionContext])

	return (
		<Paper
        elevation = {4}
        sx        = {{
            position: 'absolute',
            top:      '10%',
            right:    '40px',
            width:    '90px',
            height:   '75%',

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
