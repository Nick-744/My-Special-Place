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
    onlyOneActive = false, // If true, only 1 group can be active at a time!
}) => {
    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)
    const paperRef  = useRef(null)

    const [isOpen, setIsOpen] = useState(false)

    const { activeFiltersContext, setActiveFiltersContext } = globalVar
    const activeItems                                       = activeFiltersContext[filterKey]

    // Extract unique values for this filter
    const uniqueItems = [...new Set(eventsData.map(e => e[filterKey]))]

    // Initialize filter values
    useEffect(() => {
        if (onlyOneActive)
            // Fallback to index 0 if undefined!
            setActiveFiltersContext(prev => ({...prev, [filterKey]: [uniqueItems[1] || uniqueItems[0]]}))
        else
            setActiveFiltersContext(prev => ({...prev, [filterKey]: uniqueItems}))
    }, [])

    // Update visibility based on *all* active filters
    useEffect(() => {
        eventRefs.current.forEach((ref, i) => {
            if (!ref?.current) return;

            const event             = eventsData[i]
            const iconColor         = eventIconRefs.current[i].current.material.color
            const matchesAllFilters = Object.entries(activeFiltersContext).every(
                ([key, values]) => values.includes(event[key])
            )

            if (!matchesAllFilters) iconColor.set(0xffffff) // === SPECIAL WAY === //
            else                    iconColor.set(getColor(event[filterKey], event))

            ref.current.traverse((child) => {
                child.raycast = matchesAllFilters ? THREE.Mesh.prototype.raycast : () => {}
            })
        })
    }, [activeFiltersContext, eventRefs])

    useEffect(() => {
        if (!globalVar.mobileViewContext || !isOpen) return;

        const handleClick = (e) => {
            if (paperRef.current && !paperRef.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClick)

        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, globalVar.mobileViewContext])

    // Toggle item - Global setter
    const toggleItem = (item) => {
        setActiveFiltersContext(prev => {
            const current = prev[filterKey]
            const updated = onlyOneActive
                ? [item]
                : current.includes(item)
                    ? current.filter(i => i !== item)
                    : [...current, item]

            return {...prev, [filterKey]: updated};
        })

        /*  This logic toggles the selected item in the global filter state:

            - If the item is already active (included in the current array),
            it gets removed using [filter(i => i !== item)].

            - If the item is not active, it's added to the list using [...current, item].

            - If onlyOneActive is true, it skips toggling and just sets the array to [item],
            ensuring that only one option can be active at a time.
        */
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
