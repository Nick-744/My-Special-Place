import { size, cylinderHeight } from '../../MyConfig'

import { useTexture, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three';

// Custom ShaderMaterial
const FadeMaterial = shaderMaterial(
	{ map: null },
	// Vertex Shader
	`
		varying vec2 vUv;
		varying float vY;

		void main() {
			vUv = uv;
			vY  = position.y;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,

	// Fragment Shader
	`
		uniform sampler2D map;
		varying vec2 vUv;
		varying float vY;

		void main() {
			float H     = ${cylinderHeight.toFixed(1)};
			float yNorm = clamp((vY + H / 2.0) / H, 0.0, 1.0);
			float fade  = smoothstep(0.0, 0.6, yNorm); // fade in from bottom 60%

			vec4 texColor = texture2D(map, vUv);
			float alpha   = texColor.a * fade;

			if (alpha < 0.01) discard;
			float fakeLight = mix(1.2, 1.8, yNorm);
			vec3 litColor   = texColor.rgb * fakeLight;
			gl_FragColor    = vec4(litColor, alpha);
		}
	`
)

extend({ FadeMaterial });

const BGImageCylinder = ({ position = [0, 0, 0] }) => {
	const bgTexture = useTexture(
		'./Assets/ImageData/aleksander_background3D.jpg'
	)

	return (
		<mesh
		position = {[
			0 + position[0],
			cylinderHeight / 2 + position[1],
			0 + position[2]
		]}
		>
			<cylinderGeometry args = {[size / 3, size / 1.5, cylinderHeight, 64, 64, true]} />
			{/* radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded */}

			<fadeMaterial
			map  = {bgTexture}
			side = {THREE.BackSide}

			transparent = {true}
			/>
		</mesh>
	);
}

export default BGImageCylinder;
