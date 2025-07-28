import { createContext, useState } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [eventHoveringContext, setEventHoveringContext] = useState(-1)
    const [selectedEventContext, setSelectedEventContext] = useState(null)
    const [isModalOpenContext,   setIsModalOpenContext  ] = useState(false)
    
    // Controls the visibility [opacity] of all panels
    const [panelsVisibility,     setPanelsVisibility    ] = useState(true)

    return (
        <globalVarContext.Provider 
        value = {{
            eventHoveringContext, setEventHoveringContext,
            selectedEventContext, setSelectedEventContext,
            isModalOpenContext,   setIsModalOpenContext,
            panelsVisibility,     setPanelsVisibility
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
