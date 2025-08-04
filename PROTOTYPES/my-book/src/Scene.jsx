import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Book from './Assets3D/Book.jsx'
import { Suspense } from 'react'

const Scene = () => {
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			<Loader />
			<Canvas camera = {{ position: [-0.5, 1, 8], fov: 45 }} shadows>
				<Suspense fallback = {null}>
					
					<group position-y = {0}>
						<Environment preset = 'studio' />
						<directionalLight
						position  = {[2, 5, 4]}
						intensity = {2.5}
						castShadow
						shadow-mapSize-width  = {2048}
						shadow-mapSize-height = {2048}
						shadow-bias           = {-0.0001}
						/>

						<OrbitControls />

						<Book />

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
