import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import * as THREE from 'three'
import { eventsData } from '../../InfoData/EventsData'

const RotatingFilter = ({
    eventRefs,
    eventIconRefs,
    filterKey,    // 'type' or 'section'
    getColor,     // (value, event) => color string
}) => {
    const [currentActiveIndex, setCurrentActiveIndex] = useState(0)

    const uniqueItems = [...new Set(eventsData.map(e => e[filterKey]))]

    useEffect(() => {
        eventRefs.current.forEach((ref, i) => {
            const iconRef = eventIconRefs.current[i]
            if (!ref?.current || !iconRef?.current) return

            const event = eventsData[i]
            const item = event[filterKey]
            const itemIndex = uniqueItems.indexOf(item)
            const isCurrentActive = itemIndex === currentActiveIndex

            // Set position.y
            // iconRef.current.position.y = isCurrentActive ? 0 : 10

            // Set color
            iconRef.current.material.color.set(
                isCurrentActive ? getColor(item, event) : 0xffffff
            )

            // Toggle raycasting
            ref.current.traverse((child) => {
                child.raycast = isCurrentActive ? THREE.Mesh.prototype.raycast : () => {}
            })
        })
    }, [currentActiveIndex, eventRefs, eventIconRefs, uniqueItems, getColor])

    const rotateToNext = () => {
        setCurrentActiveIndex(prev => (prev + 1) % uniqueItems.length)
    }

    return (
        <Button
            variant="contained"
            onClick={rotateToNext}
            sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 1000,
                textTransform: 'none',
                backgroundColor: '#2196f3 !important',
                color: '#fff !important',
                '&:hover': {
                    backgroundColor: '#1976d2 !important',
                    transform: 'scale(1.05)',
                },
            }}
        >
            ↻
        </Button>
    )
}

export default RotatingFilter
