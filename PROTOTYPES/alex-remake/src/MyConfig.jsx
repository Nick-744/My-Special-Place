// ==================== Animated Grid Configuration ====================
export const size        = 300;              // Grid size (units)
export const divisions   = 220;              // Number of grid divisions
export const step        = size / divisions; // Step size for grid nodes
export const scaleEffect = 0.025;            // Wave amplitude multiplier - [Utils.jsx] **
export const cameraPos   = [0, 100, 0];      // Fake initial camera position for grid effect!!!
export const nodeDensity = 3;                // Node spacing
export const wireframeColor = '#00aaff';   // Wireframe color
export const gridOpacity    = 0.1;           // Opacity of the grid lines

export const particlesSize  = 0.2;  // Particle size
export const particlesSpeed = 0.03; // Particle movement speed
export const particleCount  = 6000; // Number of particles in the system

// Size-based bounds for particle system
export const bounds = {
  x: size / 2,
  y: 30, // Keep vertical spread tight for visual clarity
  z: size / 2
};

// ==================== Camera Control Configuration ====================
// Προσοχή! Ο αριθμητής πρέπει να είναι μεταξύ του 0 και του divisions
export const minZPosition = Math.ceil(step * 90 / 2)                 // Minimum visible Z position limit
export const maxZPosition = Math.ceil(step * ((divisions - 22) / 2)) // Maximum visible Z position limit

export const cameraInitialZ  = Math.ceil(step * (divisions / 2)) // Initial Z position for the camera
export const cameraLooking   = [0, -200, -2000] // Camera look-at target position
export const cameraHeight    = 3.0; // Camera height above the grid
export const cameraFOV       = 30;  // Camera field of view
export const cameraZoomSpeed = 1.0; // Speed of zooming with mouse wheel

// ==================== Timestamps Configuration ====================
export const timestamps = [
  -360, -350, -345, -340, -338, -336, -334,
  -332, -330, -328, -326, -325, -324, -322
]
export const timestampsXPosition = 4   // Integer value!
export const exponentialBase     = 3.0 // Base for exponential mapping - Make the spacing better!

// ==================== Event Configuration ====================
export const eventYFloat     = 0.5  // Float value y [offset above wave]
export const eventsXPosition = -step * 1
export const eventWaveEffect = 3    // Wave effect multiplier for events

export const originalColor = {
  'Μάχες και Πολιορκίες':    '#ff0000',
  'Η Ζωή του Μ. Αλεξάνδρου': '#1f51ff',
  'Ίδρυση Πόλεων':           '#008000'
} // Original color for events
export const hoveredColor  = '#ffA500'

// ==================== Grid Objects Configuration ====================
export const gObjRotationX = -0.2 // Grid Objects [gObj] Rotation around X-axis
