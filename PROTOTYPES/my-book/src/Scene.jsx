import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { UI } from './Assets3D/UI.jsx'
import Book from './Assets3D/Book.jsx'
import { Suspense } from 'react'

const Scene = () => {
	return (
		<div id = 'canvas-container' className = 'w3-animate-opacity'>
			<UI />
			<Loader />
			<Canvas shadows camera = {{ position: [-0.5, 1, 4], fov: 45 }}>
				<group position-y = {0}>
					<Suspense fallback = {null}>
						<OrbitControls />
						<Environment preset='studio'></Environment>
						<directionalLight
							position={[2, 5, 2]}
							intensity={2.5}
							castShadow
							shadow-mapSize-width={2048}
							shadow-mapSize-height={2048}
							shadow-bias={-0.0001}
						/>

						<Book />

						<mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
							<planeGeometry args={[100, 100]} />
							<shadowMaterial transparent opacity={0.2} />
						</mesh>
					</Suspense>
				</group>
			</Canvas>
		</div>
	);
}

export default Scene;
