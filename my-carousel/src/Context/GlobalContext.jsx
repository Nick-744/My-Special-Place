import { createContext, useState } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    const [globalGroupRef, setGlobalGroupRef]   = useState(null)
    const [rigCameraActive, setRigCameraActive] = useState(false)
    const [activeCardView, setActiveCardView]   = useState(false)

    return (
        <globalVarContext.Provider 
        value = {{
            globalGroupRef, setGlobalGroupRef,
            rigCameraActive, setRigCameraActive,
            activeCardView, setActiveCardView
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
