import { useMediaQuery, useTheme } from '@mui/material'
import { eventsData } from '../InfoData/EventsData'
import { createContext, useState } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [eventHoveringContext, setEventHoveringContext] = useState(-1)
    const [selectedEventContext, setSelectedEventContext] = useState(null)
    const [isModalOpenContext,   setIsModalOpenContext  ] = useState(false)
    
    // Controls the visibility [opacity] of all panels
    const [panelsVisibility,     setPanelsVisibility    ] = useState(true)

    // useTheme to determine if the user is on a mobile device!
    const theme             = useTheme()
    const mobileViewContext = useMediaQuery(theme.breakpoints.down('md'))

    // Create a state to hold the active filters!
    const [activeFiltersContext, setActiveFiltersContext] = useState({
        type:    [...new Set(eventsData.map(e => e.type   ))],
        section: [...new Set(eventsData.map(e => e.section))]
    })

    return (
        <globalVarContext.Provider 
        value = {{
            mobileViewContext,

            eventHoveringContext, setEventHoveringContext,
            selectedEventContext, setSelectedEventContext,
            isModalOpenContext,   setIsModalOpenContext,

            panelsVisibility,     setPanelsVisibility,

            activeFiltersContext, setActiveFiltersContext
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
