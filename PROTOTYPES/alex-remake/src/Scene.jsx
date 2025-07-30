import { cameraFOV, cameraInitialZ, cameraHeight } from './MyConfig'

// 3D Elements
import EventManager from './Assets3D/GridAssets/EventManager'
import Timestamps from './Assets3D/GridAssets/Timestamps'
import GridScenePackage from './Assets3D/AnimatedGrid'
import Camera3D from './Assets3D/CameraControl'

// 2D Elements
import SectionFilter from './Assets2D/Filters/SectionFilter'
import ItemFilter from './Assets2D/Filters/TypeFilter'
import EventModal from './Assets2D/Modal/EventModal'
import BackgroundImage from './Assets2D/BGImage2D'
import Timestamps2D from './Assets2D/Timestamps2D'

// General Imports
import React, { useState, useRef, useContext } from 'react'
import { globalVarContext } from './Context/GlobalContext'
import { eventsData } from './InfoData/EventsData'
import { Canvas } from '@react-three/fiber'

import { Stats } from '@react-three/drei'

const Scene = () => {
	const [cameraZPositionState, setCameraZPositionState] = useState(cameraInitialZ)

	// ----- Global ----- //
	const globalVar = useContext(globalVarContext)

	// Create an array of refs, 1 for each event
	const eventRefs     = useRef(eventsData.map(() => React.createRef()))
	const eventIconRefs = useRef(eventsData.map(() => React.createRef()))

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
					{ globalVar.mobileViewContext && <Timestamps /> }
					<EventManager eventRefs = {eventRefs} eventIconRefs = {eventIconRefs} />

			</Canvas>

			{ /* --- 2D Elements --- */ }
			<BackgroundImage />
			
			<EventModal />
			{ !globalVar.mobileViewContext && <Timestamps2D
			cameraZPositionState    = {cameraZPositionState}
			setCameraZPositionState = {setCameraZPositionState}
			/> }

			{ /* --- Filters --- */ }
			<ItemFilter    eventRefs = {eventRefs} eventIconRefs = {eventIconRefs} />
			<SectionFilter eventRefs = {eventRefs} eventIconRefs = {eventIconRefs} />
		</div>
	);
}

export default Scene;
