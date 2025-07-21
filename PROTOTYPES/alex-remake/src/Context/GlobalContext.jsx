import { createContext, useState } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [eventHoveringContext, setEventHoveringContext] = useState(true)

    return (
        <globalVarContext.Provider 
        value = {{
            eventHoveringContext, setEventHoveringContext
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
