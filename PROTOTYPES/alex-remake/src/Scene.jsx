import { cameraFOV, cameraInitialZ, cameraHeight } from './MyConfig'

import EventManager from './Assets3D/GridAssets/EventManager'
import SectionFilter from './Assets2D/Filters/SectionFilter'
import GridScenePackage from './Assets3D/AnimatedGrid'
import { eventsData } from './InfoData/EventsData'
import EventModal from './Assets2D/Modal/EventModal'
import BackgroundImage from './Assets2D/BGImage2D'
import Timestamps2D from './Assets2D/Timestamps2D'
// import Timestamps from './GridAssets/Timestamps'
import Camera3D from './Assets3D/CameraControl'
import React, { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'

// Performance stats overlay [click to toggle]
import { Stats } from '@react-three/drei'

const Scene = () => {
	const [cameraZPositionState, setCameraZPositionState] = useState(cameraInitialZ)

	const eventRefs = useRef(eventsData.map(() => React.createRef()))

	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			<Stats />
			
			{ /* --- 3D Elements --- */ }
			<Canvas camera = {{ fov: cameraFOV, position: [0, cameraHeight, cameraInitialZ] }}>

				<Camera3D
				cameraZPositionState    = {cameraZPositionState}
				setCameraZPositionState = {setCameraZPositionState}
				/>

				<GridScenePackage />
					{/* <Timestamps /> */}
					<EventManager eventRefs = {eventRefs}/>

			</Canvas>

			{ /* --- 2D Elements --- */ }
			<BackgroundImage />
			
			<EventModal />
			<Timestamps2D
			cameraZPositionState    = {cameraZPositionState}
			setCameraZPositionState = {setCameraZPositionState}
			/>
			<SectionFilter eventRefs = {eventRefs}/>
		</div>
	);
}

export default Scene;
