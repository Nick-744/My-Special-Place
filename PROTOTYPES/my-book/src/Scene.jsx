import { Loader, CameraControls } from '@react-three/drei'
import ModalImage from './Assets2D/ModalImage.jsx'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import Book from './Assets3D/Book.jsx'
import { UI } from './Assets2D/UI'

const Scene = () => {
	// State for modal image
	const [modalImageSrc, setModalImageSrc] = useState(null)
	const [modalOpen, setModalOpen]         = useState(false)

	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			{/* React component element that renders a loading
				indicator within the 3D scene application. */}
			<Loader />

			{/* Makes the loading bar working, not going 0 -> 1! */}
			<Suspense fallback = {null}>
				
				{ /* --- 3D Elements --- */ }
				<Canvas camera = {{ position: [0, 0.2, 1.8], fov: 45 }} shadows>
					<group position-y = {0}>
						{/* Lighting and shadows */}
						<ambientLight intensity = {1} />
						<directionalLight
						position  = {[2, 1.5, 3]}
						intensity = {2.5}
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

						{/* <CameraControls /> */}

						<Book
						position-y       = {-0.08}
						setModalImageSrc = {setModalImageSrc}
						setModalOpen     = {setModalOpen}
						/>

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
				<UI />

				<ModalImage
				imageSrc = {modalImageSrc}
				open     = {modalOpen}
				onClose  = {() => setModalOpen(false)}
				/>

			</Suspense>
		</div>
	);
}

export default Scene;
