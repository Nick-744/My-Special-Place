import {
	size, divisions, step, nodeDensity, wireframeColor,
	particlesSize, particlesSpeed, particleCount, bounds
} from '../MyConfig';

import { getWaveHeight, calculateDistanceFromCamera } from '../Utils';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Main grid component with animated wireframe and nodes
 */
function AnimatedGrid() {
	const gridRef  = useRef(); // Reference to grid geometry
	const nodesRef = useRef(); // Reference to node group
  
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

	// Create node positions (every [nodeDensity]-nd vertex to reduce density)
	const nodePositions = useMemo(() => {
		const positions = [];
		for (let i = 0; i <= divisions; i += nodeDensity)
			for (let j = 0; j <= divisions; j += nodeDensity)
				positions.push([-size/2 + i * step, 0, -size/2 + j * step]); // X, Y = 0, Z

		return positions;
	}, []);

	// Animation loop - runs every frame
	useFrame((state) => {
		const time = state.clock.elapsedTime;
		
		// Update grid vertices with wave displacement
		if (gridRef.current) {
			const positions = gridRef.current.geometry.attributes.position.array;
		
			for (let i = 0; i <= divisions; i++) {
				for (let j = 0; j <= divisions; j++) {
					const index = (i * (divisions + 1) + j) * 3; // Y-coordinate index
					const x     = -size/2 + i * step;
					const z     = -size/2 + j * step;
					
					// Calculate distance from camera for intensity scaling
					const distanceFromCamera = calculateDistanceFromCamera(x, z);
					
					// Apply wave displacement to Y-coordinate
					positions[index + 1] = getWaveHeight(x, z, time, distanceFromCamera);
				}
			}
		
			// Mark geometry as needing update
			gridRef.current.geometry.attributes.position.needsUpdate = true;
			
			// Animate grid opacity with breathing effect
			gridRef.current.material.opacity = 0.3 + 0.2 * Math.sin(time * 0.5);
		}
	
		// Update node positions and properties
		if (nodesRef.current) {
			nodesRef.current.children.forEach((node, index) => {
				const [x, _, z] = nodePositions[index];
				
				// Calculate distance from camera for intensity scaling
				const distanceFromCamera = calculateDistanceFromCamera(x, z);
				
				// Apply same wave displacement as grid
				const newY = getWaveHeight(x, z, time, distanceFromCamera);
				node.position.set(x, newY, z);
				
				// Scale nodes based on height and add pulsing animation
				const scale = 1 + Math.abs(newY) * 0.3 + 0.5 * Math.sin(time * 2 + index * 0.1);
				node.scale.setScalar(scale);
			});
		}
	});

	return (
		<group>
			{/* Wireframe grid lines */}
			<lineSegments ref = {gridRef} geometry = {gridGeometry}>
				<lineBasicMaterial
				color   = {wireframeColor}
				transparent
				opacity = {0.3}
				/>
			</lineSegments>
			
			{/* Node spheres at grid intersections */}
			<group ref = {nodesRef}>
				{nodePositions.map((pos, index) => (
					<mesh key = {index} position = {pos}>
						<sphereGeometry args = {[0.04, 16, 16]} />
						<meshBasicMaterial color = '#ffffff' />
					</mesh>
				))}
			</group>
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
function GridScenePackage({ packPosition = [0, 0, 0] }) {
	return (
		<>
			{/* Main grid component */}
			<mesh position = {packPosition}>
				<AnimatedGrid />
			</mesh>
			
			{/* Particle system positioned below grid */}
			<mesh position = {[packPosition[0], packPosition[1] - bounds.y + 10, packPosition[2]]}>
				<Particles />
			</mesh>
		</>
	);
}

export default GridScenePackage;
