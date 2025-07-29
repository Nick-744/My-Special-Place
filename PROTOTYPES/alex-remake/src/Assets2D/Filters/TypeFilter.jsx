import { originalColor, panelsOpacityEventHovering } from '../../MyConfig'

import { globalVarContext } from '../../Context/GlobalContext'
import { useState, useEffect, useContext } from 'react'
import { eventsData } from '../../InfoData/EventsData'
import { Button, Paper } from '@mui/material'
import * as THREE from 'three'

const TypeFilter = ({ eventRefs, eventIconRefs }) => {
    const [activeTypes, setActiveTypes] = useState([])
    const [isOpen,      setIsOpen     ] = useState(false)

    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)

    // Extract unique types
    const uniqueTypes = [...new Set(eventsData.map(e => e.type))]

    // Initialize: all types visible
    useEffect(() => { setActiveTypes(uniqueTypes) }, [])

    // Apply visibility changes
    useEffect(() => {
        eventRefs.current.forEach((ref, i) => {
            if (!ref?.current) return; // Skip if ref is not set!

            const event      = eventsData[i]
            const shouldShow = activeTypes.includes(event.type)

			// Visibility control | === SPECIAL WAY === //
            if (!shouldShow) eventIconRefs.current[i].current.material.color.set(0xffffff) // Set to white for effect!
            else             eventIconRefs.current[i].current.material.color.set(originalColor[event.section])

			// --- Disable pointer interaction when hidden ---
			ref.current.traverse((child) => {
                child.raycast = shouldShow ? THREE.Mesh.prototype.raycast : () => {}
			})
        })
    }, [activeTypes, eventRefs])

    // Toggle type visibility
    const toggleType = (type) => {
        setActiveTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
            /*  First, it checks if the current type already exists in the previous state
            using [prev.includes(type)]. If the type is found, it means the user is
            trying to deactivate it, so the function uses [prev.filter(t => t !== type)]
            to create a new array with that type removed. The filter method keeps all
            elements except the 1 that matches the type being toggled off.

                If the type is not currently active, the function takes the opposite
            approach using the spread operator [[...prev, type]] to create a new array
            containing all previously active types plus the new 1! */
        )
    }

    return (
        <Paper
        elevation = {4}
        sx        = {{
            position:        'absolute',
            bottom:          globalVar.mobileViewContext ? 'auto'   : '10px',
            top:             globalVar.mobileViewContext ? '10px'   : 'auto',
            left:            globalVar.mobileViewContext ? (isOpen ? '10px' : '-235px') : '-205px',
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
                : { '&:hover':  { left: '10px' } }
            )
        }}
        >
            {/* Show tab arrow */}
            <div
            style = {{
                position:  'absolute',
                top:       '50%',
                right:     '-25px',
                padding:   '0px 6px 5px 5px',
                transform: 'translateY(-50%)',
                color:           '#5f5f5f',
                backgroundColor: '#fafafa',
                borderTopRightRadius:    '7px',
                borderBottomRightRadius: '7px',
                fontWeight: 'bold',
                fontSize:   '30px',
                cursor:     'pointer',
                zIndex:     1000
            }}
            onClick = {() => globalVar.mobileViewContext ? setIsOpen(!isOpen) : null}
            > {isOpen ? '«' : '»'} </div>

            {uniqueTypes.map((type, idx) => {
                const isActive = activeTypes.includes(type)
				const color    = '#999999'

                return (
                    <Button
                    key     = {idx}
                    variant = 'contained'
                    onClick = {() => toggleType(type)}
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
                        {type}
                    </Button>
                );
            })}
        </Paper>
    );
}

export default TypeFilter;
