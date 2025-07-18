import { cameraFOV, cameraInitialZ, cameraHeight } from '../MyConfig'

import BGImageCylinder from './BackGround/BGImageCylinder'
import EventManager from './GridAssets/EventManager'
import BackgroundImage from '../Assets2D/BGImage2D'
import Timestamps from './GridAssets/Timestamps'
import GridScenePackage from './AnimatedGrid'
import { Canvas } from '@react-three/fiber'
import Camera3D from './CameraControl'

// Performance stats overlay [click to toggle]
import { OrbitControls, Stats } from '@react-three/drei'

const Scene_3D = () => {
	return (
		<div
		id        = 'canvas-container'
		className = 'w3-animate-opacity'
		>
			<Stats />

			{/* <BackgroundImage /> */}
			<Canvas
			camera = {{
				fov:      cameraFOV,
				position: [0, cameraHeight, cameraInitialZ]
			}}
			>

				<Camera3D />
				{/* <OrbitControls /> */}

				<BGImageCylinder />
				<GridScenePackage />
					<Timestamps />
					<EventManager />
				
			</Canvas>
		</div>
	);
}

export default Scene_3D;
