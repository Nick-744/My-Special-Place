import { GlobalProviderComponent } from './Context/GlobalContext'
import { createRoot } from 'react-dom/client'
import Scene_3D from './Assets3D/Scene3D'
import { StrictMode } from 'react'
import './index.css'

createRoot(
    document.getElementById('root')
).render(
    <>
        <StrictMode>
            <GlobalProviderComponent>
            
                <Scene_3D />
            
            </GlobalProviderComponent>
        </StrictMode>
    </>
);
