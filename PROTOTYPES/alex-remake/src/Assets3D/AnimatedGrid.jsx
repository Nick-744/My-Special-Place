import {
	size, divisions, step, wireframeColor, particlesSize,
	particlesSpeed, particleCount, bounds, gridOpacity
} from '../MyConfig';

import { globalVarContext } from '../Context/GlobalContext';
import { useRef, useMemo, useContext } from 'react';
import { getWaveHeight } from '../Helpers/Utils';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Main grid component with animated wireframe and nodes
 */
function AnimatedGrid() {
	const gridRef  = useRef(); // Reference to grid geometry
  
	// Create static grid geometry (wireframe structure)
	const gridGeometry = useMemo(() => {
		const geometry  = new THREE.BufferGeometry();
		const positions = [];
		const indices   = [];
	
		// Create vertices for each grid intersection
		for (let i = 0; i <= divisions; i++)
			for (let j = 0; j <= divisions; j++)
				positions.push(-size/2 + i * step, 0, -size/2 + j * step); // X, Y = 0, Z
			
		// Create line indices for wireframe connections
		for (let i = 0; i < divisions; i++) {
			for (let j = 0; j < divisions; j++) {
				const a = i * (divisions + 1) + j;       // Current vertex
				const b = a + 1;                         // Next vertex horizontally
				const c = (i + 1) * (divisions + 1) + j; // Next vertex vertically
				
				indices.push(a, b, a, c); // Add horizontal and vertical lines
				
				// Close the grid edges
				if (i === divisions - 1) indices.push(c, c + 1);
				if (j === divisions - 1) indices.push(b, c + 1);
			}
		}
		
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
		geometry.setIndex(indices);

		return geometry;
	}, []);

	// Animation loop - runs every frame
	useFrame((state) => {
		const time = state.clock.elapsedTime;
		
		// Update grid vertices with wave displacement
		const positions = gridRef.current.geometry.attributes.position.array;
	
		for (let i = 0; i <= divisions; i++) {
			for (let j = 0; j <= divisions; j++) {
				const index = (i * (divisions + 1) + j) * 3; // Y-coordinate index
				const x     = -size/2 + i * step;
				const z     = -size/2 + j * step;
				
				// Apply wave displacement to Y-coordinate
				positions[index + 1] = getWaveHeight(x, z, time);
			}
		}
	
		// Mark geometry as needing update
		gridRef.current.geometry.attributes.position.needsUpdate = true;
	});

	return (
		<group>
			{/* Wireframe grid lines */}
			<lineSegments ref = {gridRef} geometry = {gridGeometry}>
				<lineBasicMaterial
				color     = {wireframeColor}
				side      = {THREE.DoubleSide}
				depthTest = {false}
				opacity   = {gridOpacity}
				transparent
				/>
			</lineSegments>
		</group>
	);
}

/**
 * Floating particle system for ambient effects
 */
function Particles() {
	const particlesRef  = useRef();
	
	// Initialize particle positions and velocities
	const particles = useMemo(() => {
		const positions  = new Float32Array(particleCount * 3);
		const velocities = [];
		
		for (let i = 0; i < particleCount; i++) {
			// Random positions within volume
			positions[i * 3    ] = (Math.random() - 0.5) * bounds.x * 2; // X
			positions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y * 2; // Y
			positions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z * 2; // Z
			
			// Random velocities for movement
			velocities.push({
				x: (Math.random() - 0.5) * particlesSpeed,
				y: (Math.random() - 0.5) * particlesSpeed,
				z: (Math.random() - 0.5) * particlesSpeed
			});
		}
		
		return { positions, velocities };
	}, []);
  
	// Animate particles each frame
	useFrame(() => {
		if (particlesRef.current) {
			const positions = particlesRef.current.geometry.attributes.position.array;
			
			for (let i = 0; i < particleCount; i++) {
				// Update positions based on velocity
				positions[i * 3    ] += particles.velocities[i].x;
				positions[i * 3 + 1] += particles.velocities[i].y;
				positions[i * 3 + 2] += particles.velocities[i].z;
				
				// Bounce particles off boundaries
				if (Math.abs(positions[i * 3    ]) > bounds.x) particles.velocities[i].x *= -1;
				if (Math.abs(positions[i * 3 + 1]) > bounds.y) particles.velocities[i].y *= -1;
				if (Math.abs(positions[i * 3 + 2]) > bounds.z) particles.velocities[i].z *= -1;
			}
			
			// Mark geometry as needing update
			particlesRef.current.geometry.attributes.position.needsUpdate = true;
		}
	});
	
	return (
		<points ref = {particlesRef}>
			<bufferGeometry>
				<bufferAttribute
				attach   = 'attributes-position'
				count    = {particleCount}
				array    = {particles.positions}
				itemSize = {3}
				/>
			</bufferGeometry>

			<pointsMaterial
			color   = '#ffffff'
			size    = {particlesSize}
			transparent
			opacity = {0.6}
			/>
		</points>
	);
}

/**
 * Main grid scene setup
 */
function GridScenePackage({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
	// ----- Global ----- //
	const globalVar = useContext(globalVarContext);

	return (
		<>
			{/* Main grid component */}
			<mesh position = {position} rotation = {rotation}>
				<AnimatedGrid />
			</mesh>
			
			{/* Particle system positioned below grid */}
			{ !globalVar.mobileViewContext && <mesh
			position = {[position[0], position[1] - bounds.y + 10, position[2]]}
			rotation = {rotation}
			>
				<Particles />
			</mesh> }
		</>
	);
}

export default GridScenePackage;
