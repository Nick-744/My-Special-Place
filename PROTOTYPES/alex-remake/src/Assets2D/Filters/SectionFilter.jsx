import { originalColor, panelsOpacityEventHovering } from '../../MyConfig'

import { globalVarContext } from '../../Context/GlobalContext'
import { useState, useEffect, useContext } from 'react'
import { eventsData } from '../../InfoData/EventsData'
import { Button, Paper } from '@mui/material'
import * as THREE from 'three'

const SectionFilter = ({ eventRefs, eventIconRefs }) => {
    const [activeSections, setActiveSections] = useState([])
    const [isOpen,         setIsOpen        ] = useState(false)

    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)

    // Extract unique sections
    const uniqueSections = [...new Set(eventsData.map(e => e.section))]

    // Initialize: all sections visible
    useEffect(() => { setActiveSections(uniqueSections) }, [])

    // Apply visibility changes
    useEffect(() => {
        eventRefs.current.forEach((ref, i) => {
            if (!ref?.current) return; // Skip if ref is not set!

            const event      = eventsData[i]
            const shouldShow = activeSections.includes(event.section)

			// Visibility control | === SPECIAL WAY === //
            if (!shouldShow) eventIconRefs.current[i].current.material.color.set(0xffffff) // Set to white for effect!
            else             eventIconRefs.current[i].current.material.color.set(originalColor[event.section])

			// --- Disable pointer interaction when hidden ---
			ref.current.traverse((child) => {
                child.raycast = shouldShow ? THREE.Mesh.prototype.raycast : () => {}
			})
        })
    }, [activeSections, eventRefs])

    // Toggle section visibility
    const toggleSection = (section) => {
        setActiveSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
            /*  First, it checks if the current section already exists in the previous state
            using [prev.includes(section)]. If the section is found, it means the user is
            trying to deactivate it, so the function uses [prev.filter(s => s !== section)]
            to create a new array with that section removed. The filter method keeps all
            elements except the 1 that matches the section being toggled off.

                If the section is not currently active, the function takes the opposite
            approach using the spread operator [[...prev, section]] to create a new array
            containing all previously active sections plus the new 1! */
        )
    }

    return (
        <Paper
        elevation = {4}
        sx        = {{
            position:        'absolute',
            top:             globalVar.mobileViewContext ? (isOpen ? '10px' : '-210px') : '30px',
            left:            globalVar.mobileViewContext ? '10px' : '30px',
            display:         'flex',
            flexDirection:   'column',
            backgroundColor: '#fafafa',
			padding:         2,
			gap:             1,
            borderRadius:    3,
            zIndex:          1000,
            opacity:         globalVar.panelsVisibility ? 1 : panelsOpacityEventHovering,

			// Make component responsive [bigger]!
            transition: 'all 0.3s ease',
            ...(globalVar.mobileViewContext
                ? {}
                : { '&:hover': { transform: 'scale(1.03)' } }
            )
        }}
        >
            {/* Mobile ONLY toggle arrow */}
            { globalVar.mobileViewContext && <div
            style = {{
                position:  'absolute',
                bottom:    '-52px',
                left:      '46%',
                padding:   '0px 6px 5px 5px',
                transform: 'translateY(-50%) rotate(90deg)',
                color:           '#5f5f5f',
                backgroundColor: '#fafafa',
                borderTopRightRadius:    '7px',
                borderBottomRightRadius: '7px',
                fontWeight: 'bold',
                fontSize:   '30px',
                cursor:     'pointer',
                zIndex:     1000
            }}
            onClick = {() => setIsOpen(!isOpen)}
            > {isOpen ? '«' : '»'} </div> }

            {uniqueSections.map((section, idx) => {
                const isActive = activeSections.includes(section)
				const color    = originalColor[section] || '#ffff00'

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
