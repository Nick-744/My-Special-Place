import { useState, useEffect, useContext, useRef } from 'react'
import { globalVarContext } from '../../Context/GlobalContext'
import { eventsData } from '../../InfoData/EventsData'
import { Paper, Button } from '@mui/material'
import * as THREE from 'three'

const GenericFilter = ({
    eventRefs,
    eventIconRefs,
    filterKey,      // 'type' or 'section'
    getColor,       // (value, event) => color string
    positionConfig, // Mobile/Desktop styles injection
    customArrow,    // Custom arrow render (optional)
}) => {
    const [activeItems, setActiveItems] = useState([])
    const [isOpen,      setIsOpen     ] = useState(false)
    const globalVar = useContext(globalVarContext) /* --- GLOBAL --- */
    const paperRef  = useRef(null)

    // Extract unique sections
    const uniqueItems = [...new Set(eventsData.map(e => e[filterKey]))]

    // Initialize: all sections visible
    useEffect(() => { setActiveItems(uniqueItems) }, [])

    // Apply visibility changes
    useEffect(() => {
        eventRefs.current.forEach((ref, i) => {
            if (!ref?.current) return; // Skip if ref is not set!

            const event      = eventsData[i]
            const item       = event[filterKey]
            const shouldShow = activeItems.includes(item)

            // Visibility control | === SPECIAL WAY === //
            if (!shouldShow) eventIconRefs.current[i].current.material.color.set(0xffffff) // Set to white for effect!
            else             eventIconRefs.current[i].current.material.color.set(getColor(item, event))

            // --- Disable pointer interaction when hidden ---
            ref.current.traverse((child) => {
                child.raycast = shouldShow ? THREE.Mesh.prototype.raycast : () => {}
            })
        })
    }, [activeItems, eventRefs])

    useEffect(() => {
        if (!globalVar.mobileViewContext || !isOpen) return;

        const handleClick = (e) => {
            if (paperRef.current && !paperRef.current.contains(e.target))
                setIsOpen(false)
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [isOpen, globalVar.mobileViewContext])

    // Toggle item visibility
    const toggleItem = (item) => {
        setActiveItems(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
            /*  First, it checks if the current item already exists in the previous state
            using [prev.includes(item)]. If the item is found, it means the user is
            trying to deactivate it, so the function uses [prev.filter(i => i !== item)]
            to create a new array with that item removed. The filter method keeps all
            elements except the 1 that matches the item being toggled off.

                If the item is not currently active, the function takes the opposite
            approach using the spread operator [[...prev, item]] to create a new array
            containing all previously active items plus the new 1! */
        )
    }

    return (
        <Paper
        ref       = {paperRef}
        elevation = {4}
        sx        = {{
            position:        'absolute',
            display:         'flex',
            flexDirection:   'column',
            backgroundColor: '#fafafa',
            padding:      2,
            gap:          1,
            borderRadius: 3,
            zIndex:       1000,
            transition:   'all 0.3s ease',
            ...positionConfig(globalVar, isOpen),
        }}
        >
            {customArrow && customArrow({ isOpen, setIsOpen, mobile: globalVar.mobileViewContext })}

            {uniqueItems.map((item, idx) => {
                const isActive = activeItems.includes(item)
                const color    = getColor(item)

                return (
                    <Button
                    key     = {idx}
                    variant = 'contained'
                    onClick = {() => toggleItem(item)}
                    size    = 'medium'
                    sx      = {{
                        textTransform:   'none',
                        backgroundColor: isActive ? `${color} !important` : '#e0e0e0',
                        color:           isActive ? '#fff !important' : '#444',
                        border:          `1px solid ${color}`,
                        '&:hover': {
                            backgroundColor: isActive ? `${color} !important` : '#d5d5d5',
                            transform:       'scale(1.05)',
                        },
                    }}
                    >
                        {item}
                    </Button>
                );
            })}
        </Paper>
    );
}

export default GenericFilter;
