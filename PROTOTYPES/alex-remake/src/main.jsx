import { GlobalProviderComponent } from './Context/GlobalContext'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Scene from './Scene'
import './index.css'

createRoot(
    document.getElementById('root')
).render(
    <>
        <GlobalProviderComponent>
        
            <Scene />
        
        </GlobalProviderComponent>
    </>
);
