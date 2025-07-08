import { Canvas } from '@react-three/fiber'
import Scene from "./Scene"
import { Leva } from 'leva'

const App = () => {
    return (
        <div>
            <Canvas>

                <Scene />
                
            </Canvas>

            <Leva />
        </div>
    );
}

export default App;
