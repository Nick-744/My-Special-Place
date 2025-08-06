import { Environment, CameraControls } from '@react-three/drei'
import { Loader, Float } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import Book from './Assets3D/Book.jsx'
import { Suspense } from 'react'

const Scene = () => {
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			{/* React component element that renders a loading
				indicator within the 3D scene application. */}
			<Loader />

			<Canvas camera = {{ position: [0, 1.5, 4], fov: 45 }} shadows>
				{/* Makes the loading bar working, not going 0 -> 1! */}
				<Suspense fallback = {null}>
					
					<group position-y = {0}>
						{/* Environment lighting and shadows */}
						<Environment preset = 'dawn' intensity = {0.6} />
						<ambientLight intensity = {0.4} />
						<directionalLight
						position  = {[2, 8, 5]}
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

						<CameraControls />

						{/* Make the book float randomly in the air */}
						<Float
						rotation-x        = {-Math.PI / 5}
						floatIntensity    = {1}
						speed             = {1.6}
						rotationIntensity = {1}
						>
							<Book />
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

				</Suspense>
			</Canvas>
		</div>
	);
}

export default Scene;
