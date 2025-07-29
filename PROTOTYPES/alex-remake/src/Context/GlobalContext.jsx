import { createContext, useState, useEffect } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [eventHoveringContext, setEventHoveringContext] = useState(-1)
    const [selectedEventContext, setSelectedEventContext] = useState(null)
    const [isModalOpenContext,   setIsModalOpenContext  ] = useState(false)
    
    // Controls the visibility [opacity] of all panels
    const [panelsVisibility,     setPanelsVisibility    ] = useState(true)

    // Context to determine if the user is on a mobile device!
    const [mobileViewContext,    setMobileViewContext   ] = useState(false)

    useEffect(() => {
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768
        setMobileViewContext(isMobile)
    }, [])

    return (
        <globalVarContext.Provider 
        value = {{
            mobileViewContext,    setMobileViewContext,

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
