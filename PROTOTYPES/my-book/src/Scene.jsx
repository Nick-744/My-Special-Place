import { Environment, Loader } from '@react-three/drei'
import ModalImage from './Assets2D/ModalImage.jsx'
import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import Book from './Assets3D/Book.jsx'

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
				
				<Canvas camera = {{ position: [0, 0.2, 1.8], fov: 45 }} shadows>
					<group position-y = {0}>
						{/* Environment lighting and shadows */}
						<Environment preset = 'dawn' intensity = {0.6} />
						<ambientLight intensity = {0.4} />
						<directionalLight
						position  = {[3, 2.5, 5]}
						intensity = {0.3}
						color     = '#ffffff'
						castShadow
						shadow-mapSize-width  = {2048}
						shadow-mapSize-height = {2048}
						/>
						<directionalLight
						position   = {[-2, 4, 3]}
						intensity  = {0.2}
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
