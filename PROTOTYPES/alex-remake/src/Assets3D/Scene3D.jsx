import { cameraFOV, cameraInitialZ } from '../MyConfig'

import EventManager from './GridAssets/EventManager'
import Timestamps from './GridAssets/Timestamps'
import CustomScrollZoom from './CameraControl'
import GridScenePackage from './AnimatedGrid'
import { Canvas } from '@react-three/fiber'

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
			camera = {{ fov: cameraFOV, position: [0, 0.8, cameraInitialZ] }}
			>

				<ambientLight intensity = {0.5} />
				<pointLight position = {[10, 10, 10]} />

				<CustomScrollZoom />
				{/* <OrbitControls /> */}

				<GridScenePackage />
					<Timestamps />
					<EventManager />
				
			</Canvas>
		</div>
	);
}

export default Scene_3D;
