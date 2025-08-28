import { ScrollControls } from '@react-three/drei'
import Carousel from './Carousel/Carousel'
import { useState, useEffect } from 'react'
import Rig from './Rig/Rig'

const Scene = () => {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const touch = ('ontouchstart' in window)   ||
                  navigator.maxTouchPoints > 0 ||
                  navigator.msMaxTouchPoints > 0
    setIsTouch(touch)
  }, [])

  return (
    <>
      <ScrollControls
      pages = {3}
      infinite
      
      horizontal = {isTouch}
      >
        <Rig rotation = {[0, 0, 0.1]}>

          <Carousel />

        </Rig>
      </ScrollControls>
    </>
  );
}

export default Scene;
