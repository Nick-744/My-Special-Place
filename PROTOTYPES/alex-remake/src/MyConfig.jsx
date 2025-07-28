// ==================== Animated Grid Configuration ====================
export const size        = 300              // Grid size (units)
export const divisions   = 350              // Number of grid divisions
export const step        = size / divisions // Step size for grid nodes
export const scaleEffect = 0.025            // Wave amplitude multiplier - [Utils.jsx] **
export const cameraPos   = [0, 100, 0]      // Fake initial camera position for grid effect!!!
export const nodeDensity = 3                // Node spacing
export const wireframeColor = '#00aaff'   // Wireframe color
export const gridOpacity    = 0.1           // Opacity of the grid lines

export const particlesSize  = 0.2  // Particle size
export const particlesSpeed = 0.03 // Particle movement speed
export const particleCount  = 5000 // Number of particles in the system

// Size-based bounds for particle system
export const bounds = {
	x: size / 2,
	y: 30, // Keep vertical spread tight for visual clarity
	z: size / 2
}

// ==================== Camera Control Configuration ====================
// Προσοχή! Ο αριθμητής πρέπει να είναι μεταξύ του 0 και του divisions
export const minZPosition = Math.ceil(step * 60 / 2)                 // Minimum visible Z position limit
export const maxZPosition = Math.ceil(step * ((divisions - 22) / 2)) // Maximum visible Z position limit

export const cameraInitialZ  = Math.ceil(step * (divisions / 2)) // Initial Z position for the camera
export const cameraLooking   = [0, -260, -2000] // Camera look-at target position
export const cameraHeight    = 3.0 // Camera height above the grid
export const cameraFOV       = 30  // Camera field of view
export const cameraZoomSpeed = 1.2 // Speed of zooming with mouse wheel

// There exists a variable called: FOVconstant, in Timestamps2D.jsx. You can use it to
// transform the camera's Z position to arrow position in the Timestamps2D component!

// ==================== Timestamps Configuration ====================
export const timestamps = [
	-360, -350, -345, -340, -338, -336, -334, -332, -330, -328, -326, -325, -324, -322,
	-320, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 1900, 1950, 2000, 2010
]
export const timestampsXPosition = 4 // Integer value! For 3D timestamps.

// ==================== Event Configuration ====================
export const eventYFloat     = 0.5        // Float value y [offset above wave]
export const eventsXPosition = step * 1.5 // Offset for where is the center mass of the Grid Events!
export const eventWaveEffect = 0.8        // Wave effect multiplier for events

export const originalColor = {
	'Μάχες και Πολιορκίες':    '#ff0000',
	'Η Ζωή του Μ. Αλεξάνδρου': '#1f51ff',
	'Ίδρυση Πόλεων':           '#008000',
	'Πολιτισμικό αποτύπωμα':   '#800080'

} // Original color for events
export const hoveredColor  = '#ffA500'

// ==================== Grid Objects Configuration ====================
export const gObjRotationX    = -0.2 // Grid Objects [gObj] Rotation around X-axis
export const spaceBetweenGObj = 2.2  // Space between grid objects (events in this case)
export const gObjPathWidth    = 4    // Width of the path lines for grid objects

// ==================== Text Configuration (in grid) ====================
export const textColor = '#888888'
