import Timestamps from './GridAssets/Timestamps'
import CustomScrollZoom from './CameraControl'
import GridScenePackage from './AnimatedGrid'
import { Canvas } from '@react-three/fiber'

import PerformanceStats from '../PerformanceStats'

const Scene_3D = () => {
	return (
		<div
		id        = 'canvas-container'
		className = 'w3-animate-opacity'
		>
			<PerformanceStats />
			<Canvas
			camera = {{ fov: 60, position: [0, 0.8, Math.ceil(150/2)] }}
			>

				<ambientLight intensity = {0.5} />
				<pointLight position = {[10, 10, 10]} />

				<CustomScrollZoom />

				<GridScenePackage />
				<Timestamps />
				
			</Canvas>
		</div>
	);
}

export default Scene_3D;
