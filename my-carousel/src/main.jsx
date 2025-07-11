import { GlobalProviderComponent } from './Context/GlobalContext.jsx'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene.jsx'
import './index.css'

createRoot(
  document.getElementById('root')
).render(
  <div
  id        = "canvas-container"
  className = "w3-animate-opacity"
  >
    <Canvas
    camera = {{ position: [-100, 0, 100], fov: 15 }}
    >

      <GlobalProviderComponent>

        <Scene />

      </GlobalProviderComponent>

    </Canvas>
  </div>
)
