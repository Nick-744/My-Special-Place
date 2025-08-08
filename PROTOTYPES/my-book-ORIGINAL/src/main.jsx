import { GlobalProviderComponent } from './Context/GlobalContext'
import { createRoot } from 'react-dom/client'
import { UI } from './Assets2D/UI'
import Scene from './Scene'
import './index.css'

createRoot(
    document.getElementById('root')
).render(
    <>
        <GlobalProviderComponent>
        
            <UI />
            <Scene />
        
        </GlobalProviderComponent>
    </>
);
