import { Loader, CameraControls, Float } from '@react-three/drei'
import TextOverlay from './Assets2D/TextOverlay.jsx'
import ModalImage from './Assets2D/ModalImage.jsx'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import Book from './Assets3D/Book.jsx'
import UI from './Assets2D/UI'

const Scene = () => {
	// State for modal image
	const [modalImageSrc, setModalImageSrc] = useState(null)
	const [modalOpen, setModalOpen]         = useState(false)

    // State for text overlay
	const [textOverlayOpen, setTextOverlayOpen]         = useState(false)
	const [currentLeftContent, setCurrentLeftContent]   = useState(null)
	const [currentRightContent, setCurrentRightContent] = useState(null)
	
	const handleCurrentPageChange = (leftContent, rightContent) => {
		setCurrentLeftContent(leftContent)
        setCurrentRightContent(rightContent)
    }

    const handleShowTextOverlay  = () => { setTextOverlayOpen(true) }
    const handleCloseTextOverlay = () => { setTextOverlayOpen(false) }
	
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			{/* React component element that renders a loading
				indicator within the 3D scene application. */}
			<Loader />

			{/* Makes the loading bar working, not going 0 -> 1! */}
			<Suspense fallback = {null}>
				
				{ /* --- 3D Elements --- */ }
				<Canvas camera = {{ position: [0, 1.8, 2], fov: 45 }} shadows>
					<group position-y = {0}>
						{/* Lighting and shadows */}
						<ambientLight intensity = {1} />
						<directionalLight
						position  = {[4, 5, 4]}
						intensity = {2}
						color     = '#ffffff'
						castShadow
						shadow-mapSize-width  = {2048}
						shadow-mapSize-height = {2048}
						/>
						<directionalLight
						position   = {[-2, 4, 3]}
						intensity  = {0.5}
						color      = '#f0f8ff'
						castShadow = {false}
						/>

						<CameraControls />

						<Float
						rotation-x        = {-Math.PI / 4}
						floatIntensity    = {0.8}
						speed             = {2}
						rotationIntensity = {0.8}
						>
							<Book
							setModalImageSrc    = {setModalImageSrc}
							setModalOpen        = {setModalOpen}
							onCurrentPageChange = {handleCurrentPageChange}
							/>
						</Float>

						{ /* Ground Plane */ }
						<mesh
						position-y = {-2.5}
						rotation-x = {-Math.PI / 2}
						receiveShadow
						>
							<planeGeometry args = {[100, 100]} />
							<shadowMaterial transparent opacity = {0.2} />
						</mesh>
					</group>
				</Canvas>

				{ /* --- 2D Elements / UI --- */ }
				<UI 
				onShowTextOverlay   = {handleShowTextOverlay}
				currentLeftContent  = {currentLeftContent}
				currentRightContent = {currentRightContent}
				/>

				<ModalImage
				imageSrc = {modalImageSrc}
				open     = {modalOpen}
				onClose  = {() => setModalOpen(false)}
				/>

				<TextOverlay
				leftContent  = {currentLeftContent}
				rightContent = {currentRightContent}
				open         = {textOverlayOpen}
				onClose      = {handleCloseTextOverlay}
				/>

			</Suspense>
		</div>
	);
}

export default Scene;
