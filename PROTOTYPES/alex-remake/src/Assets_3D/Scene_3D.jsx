import CustomScrollZoom from './Camera_Control'
import GridScenePackage from './Animated_Grid'
import { Canvas } from '@react-three/fiber'

const Scene_3D = () => {
	return (
		<div
		id        = 'canvas-container'
		className = 'w3-animate-opacity'
		>
			<Canvas
			camera = {{ fov: 60, position: [0, 0.5, Math.ceil(150/2)] }}
			>

				<ambientLight intensity = {0.5} />
				<pointLight position = {[10, 10, 10]} />

				<CustomScrollZoom />

				<GridScenePackage />
				
			</Canvas>
		</div>
	);
}

export default Scene_3D;
