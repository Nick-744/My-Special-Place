// import { GlobalProviderComponent } from './Context/GlobalContext'
import { createRoot } from 'react-dom/client'
import Scene from './Scene'
import './index.css'

createRoot(
    document.getElementById('root')
).render(<Scene />);
