// ==================== Animated Grid Configuration ====================
export const size        = 150;              // Grid size (units)
export const divisions   = 180;              // Number of grid divisions
export const step        = size / divisions; // Step size for grid nodes
export const scaleEffect = 0.20;             // Wave amplitude multiplier - [Utils.jsx] **
export const cameraPos   = [0, 100, 0];      // Fake initial camera position for grid effect!!!
export const nodeDensity = 3;                // Node spacing
export const wireframeColor = '#0099ee';   // Wireframe color
export const gridOpacity    = 0.1;           // Opacity of the grid lines

export const particlesSize  = 0.08; // Particle size
export const particlesSpeed = 0.03; // Particle movement speed
export const particleCount  = 5000; // Number of particles in the system

// Size-based bounds for particle system
export const bounds = {
  x: size / 2,
  y: 30, // Keep vertical spread tight for visual clarity
  z: size / 2
};

// ==================== Camera Control Configuration ====================
// Προσοχή! Ο αριθμητής πρέπει να είναι μεταξύ του 0 και του divisions
export const minZPosition = Math.ceil(step * 120 / 2)               // Minimum visible Z position limit
export const maxZPosition = Math.ceil(step * ((divisions - 8) / 2)) // Maximum visible Z position limit

export const cameraInitialZ = Math.ceil(step * divisions / 2) // Initial Z position for the camera
export const cameraLooking  = [0, -5, 0] // Camera look-at target position
export const cameraHeight   = 0.8; // Camera height above the grid
export const cameraFOV      = 55;  // Camera field of view

// ==================== Timestamps Configuration ====================
export const timestamps          = [
  -360, -350, -345, -340, -338, -336, -334, -332,
  -330, -328, -326, -325, -324, -322, -320
]
export const timestampsXPosition = 2 // Integer value!

// ==================== Event Configuration ====================
export const eventYFloat     = 0.4  // Float value y [offset above wave]
export const eventsXPosition = -step * 2
export const eventWaveEffect = 0.35 // Wave effect multiplier for events

export const originalColor = '#ff0000' // Original color for events
export const hoveredColor  = '#ffA500'
export const clickedColor  = '#a020f0'

// ==================== Background Configuration ====================
export const cylinderHeight = size / 3.4
