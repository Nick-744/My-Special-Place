// ==================== Animated Grid Configuration ====================
export const size        = 150;              // Grid size (units)
export const divisions   = 180;              // Number of grid divisions
export const step        = size / divisions; // Step size for grid nodes
export const scaleEffect = 0.2;              // Wave amplitude multiplier
export const cameraPos   = [0, -100, 4];     // Initial camera position [x, y, z]
export const nodeDensity = 2;                // Node spacing
export const wireframeColor = '#00aaff';   // Wireframe color

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
export const minZPosition = Math.ceil(150 / 2.8) // Minimum Z position limit
export const maxZPosition = Math.ceil(150 / 2) // Maximum Z position limit

// ==================== Timestamps Configuration ====================
export const timestamps          = [0, 5, 10, 12, 20, 30, 50]
export const timestampsXPosition = 2 // Integer value!

