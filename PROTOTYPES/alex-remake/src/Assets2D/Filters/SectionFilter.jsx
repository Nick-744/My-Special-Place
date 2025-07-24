import { eventsData } from '../../InfoData/EventsData'
import { originalColor } from '../../MyConfig'
import { Button, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import * as THREE from 'three'

const SectionFilter = ({ eventRefs }) => {
    const [activeSections, setActiveSections] = useState([])

    // Extract unique sections
    const uniqueSections = [...new Set(eventsData.map(e => e.section))]

    // Initialize: all sections visible
    useEffect(() => { setActiveSections(uniqueSections) }, [eventsData])

    // Apply visibility changes
    useEffect(() => {
        if (!eventRefs?.current || !eventsData) return;

        eventRefs.current.forEach((ref, i) => {
            if (!ref?.current) return;

            const event         = eventsData[i]
            const shouldShow    = activeSections.includes(event.section)

			// --- Visibility control ---
            ref.current.visible = shouldShow

			// --- Disable pointer interaction when hidden ---
			ref.current.traverse((child) => {
				if (child.isMesh)
					child.raycast = shouldShow
						? THREE.Mesh.prototype.raycast
						: () => {}
			})
        })
    }, [activeSections, eventRefs, eventsData])

    // Toggle section visibility
    const toggleSection = (section) => {
        setActiveSections(prev =>
            prev.includes(section)
				? prev.filter(s => s !== section)
				: [...prev, section]
        )
    }

    return (
        <Paper
        elevation = {4}
        sx        = {{
            position:        'absolute',
            top:             '30px',
            left:            '30px',
            display:         'flex',
            flexDirection:   'column',
            backgroundColor: '#fafafa',
			padding:         2,
			gap:             1,
            borderRadius:    3,
            zIndex:          1000,

			// Make component responsive [bigger]!
            transition: 'all 0.3s ease',
            '&:hover':  { transform: 'scale(1.06)' }
        }}
        >
            {uniqueSections.map((section, idx) => {
                const isActive = activeSections.includes(section)
				const color    = originalColor[section] || '#800080'

                return (
                    <Button
                    key     = {idx}
                    variant = 'contained'
                    onClick = {() => toggleSection(section)}
                    size    = 'medium'
                    sx      = {{
                        textTransform:   'none',
                        backgroundColor: isActive ? `${color} !important` : '#e0e0e0',
                        color:           isActive ? '#fff !important' : '#444',
                        border:          `1px solid ${color}`,
                        '&:hover': {
							backgroundColor: isActive ? `${color} !important` : '#d5d5d5',
                            transform:       'scale(1.05)',
                        }
                    }}
                    >
                        {section}
                    </Button>
                );
            })}
        </Paper>
    );
}

export default SectionFilter;
