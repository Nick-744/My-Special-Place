import { createContext, useState, useRef } from 'react'
import { cameraInitialZ } from '../MyConfig'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [eventHoveringContext,   setEventHoveringContext  ] = useState(-1)
    const [selectedEventContext,   setSelectedEventContext  ] = useState(null)
    const [isModalOpenContext,     setIsModalOpenContext    ] = useState(false)
    const [cameraZPositionContext, setCameraZPositionContext] = useState(cameraInitialZ)
    
    const eventRefsContext = useRef([])

    return (
        <globalVarContext.Provider 
        value = {{
            eventHoveringContext,   setEventHoveringContext,
            selectedEventContext,   setSelectedEventContext,
            isModalOpenContext,     setIsModalOpenContext,
            cameraZPositionContext, setCameraZPositionContext,
            
            eventRefsContext
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
