import { cameraFOV, cameraInitialZ, cameraHeight } from '../MyConfig'

import EventManager from './GridAssets/EventManager'
import BackgroundImage from '../Assets2D/BGImage2D'
import Timestamps2D from '../Assets2D/Timestamps2D'
import Timestamps from './GridAssets/Timestamps'
import GridScenePackage from './AnimatedGrid'
import { Canvas } from '@react-three/fiber'
import Camera3D from './CameraControl'

// Performance stats overlay [click to toggle]
import { OrbitControls, Stats } from '@react-three/drei'

const Scene_3D = () => {
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			<Stats />

			{ /* --- 2D Elements --- */ }
			<BackgroundImage />
			<Timestamps2D />
			
			{ /* --- 3D Elements --- */ }
			<Canvas camera = {{ fov: cameraFOV, position: [0, cameraHeight, cameraInitialZ] }}>

				<Camera3D />
				{/* <OrbitControls /> */}

				<GridScenePackage />
					{/* <Timestamps /> */}
					<EventManager />

			</Canvas>
		</div>
	);
}

export default Scene_3D;
