import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import './index.css'

createRoot(
  document.getElementById('root')
).render(
  <div>
    <Canvas
    camera = { {position: [0, 0, 0]} }
    >

      <App />
      
    </Canvas>
  </div>
)
