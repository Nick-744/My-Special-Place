import { ScrollControls } from '@react-three/drei'
import Carousel from './Carousel/Carousel'
import Rig from './Rig/Rig'

const Scene = () => {
  return (
    <>
      <ScrollControls
      pages = {3}
      infinite
      >        
        <Rig rotation = {[0, 0, 0.1]}>

          <Carousel />
          
        </Rig>
      </ScrollControls>
    </>
  );
}

export default Scene;
