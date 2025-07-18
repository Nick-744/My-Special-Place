import { cameraFOV, cameraInitialZ, cameraHeight } from '../MyConfig'

import EventManager from './GridAssets/EventManager'
import Timestamps from './GridAssets/Timestamps'
import CustomScrollZoom from './CameraControl'
import GridScenePackage from './AnimatedGrid'
import { Canvas } from '@react-three/fiber'
import BGImage from './BackGround/BGImage'

// Performance stats overlay [click to toggle]
import { OrbitControls, Stats } from '@react-three/drei'

const Scene_3D = () => {
	return (
		<div
		id        = 'canvas-container'
		className = 'w3-animate-opacity'
		>
			<Stats />
			<Canvas
			camera = {{
				fov:      cameraFOV,
				position: [0, cameraHeight, cameraInitialZ]
			}}
			>

				<ambientLight intensity = {2} />
				<pointLight position = {[10, 10, 10]} />

				<CustomScrollZoom />
				{/* <OrbitControls /> */}

				<BGImage />
				<GridScenePackage />
					<Timestamps />
					<EventManager />
				
			</Canvas>
		</div>
	);
}

export default Scene_3D;
