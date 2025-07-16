import { createContext, useState } from 'react'

export const globalVarContext = createContext(null)

export const GlobalProviderComponent = ({ children }) => {
    // Με απλό const δεν δουλεύει!!!
    // ---

    return (
        <globalVarContext.Provider 
        value = {{
        }}
        >
            {children}
        </globalVarContext.Provider>
    );
}
