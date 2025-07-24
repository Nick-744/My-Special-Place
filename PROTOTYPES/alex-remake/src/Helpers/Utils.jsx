import {
    scaleEffect, cameraPos, timestamps, minZPosition, maxZPosition, exponentialBase
} from '../MyConfig';



/** --- Calculate wave displacement for a given position and time ---
 *
 * @param {number} x    - X coordinate
 * @param {number} z    - Z coordinate
 * @param {number} time - Current time
 * @param {number} distanceFromCamera - Distance from camera position
 * 
 * @returns {number} Wave height at the given position
 */
export function getWaveHeight(x, z, time) {
    // Calculate distance from camera for intensity scaling
    const distanceFromCamera  = calculateDistanceFromCamera(x, z);
    
    // Waves get more intense farther from camera (Galaxy Video Technique).
    // Η βασική ιδέα είναι ότι θέλουμε πρακτικά 0 μεταβολή [κύματα] κοντά
    // στην κάμερα και να αυξάνεται η ένταση [εκθετικά] όσο απομακρυνόμαστε.
    const intensityMultiplier = Math.exp(distanceFromCamera) - 1;
    
    // Multiple wave patterns for complex surface
    const wave1  = Math.sin(x * 0.5 + time * 2) * 0.8;         // Primary sine wave
    const wave2  = Math.cos(z * 0.3 + time * 1.5) * 0.6;       // Perpendicular cosine wave
    const wave3  = Math.sin((x + z) * 0.2 + time * 0.8) * 1.2; // Diagonal interference wave
    const ripple = Math.sin(Math.sqrt(x*x + z*z) * 0.3 - time * 3) * 0.4; // Radial ripples
    
    return scaleEffect * (wave1 + wave2 + wave3 + ripple) * intensityMultiplier;
}



/** --- Calculates the distance from a given point (x, z) to the camera position ---
 *
 * The result is normalized by dividing by 50.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} z - The z-coordinate of the point.
 * 
 * @returns {number} The normalized distance from the camera to the point.
 */
export const calculateDistanceFromCamera = (x, z) => {
    return Math.sqrt((x - cameraPos[0])**2 + (z - cameraPos[1])**2) / 50;
}



/**
 * Calculates the Z position for an event based on its timestamp, using
 * exponential mapping to compress later values and normalize the range.
 *
 * @param {number} timestamp - The timestamp of the event to position.
 * 
 * @returns {number} The calculated Z position for the event.
 */
export function calculateEventZPosition(timestamp) {
	const safeMin   = Math.min(...timestamps)
	const safeMax   = Math.max(...timestamps)
	const safeRange = safeMax - safeMin

	// Normalize [0, 1]
	const linearNormalized = (timestamp - safeMin) / safeRange

	// Apply exponential mapping to compress later values
	const expValue = Math.exp(linearNormalized * exponentialBase) / Math.exp(exponentialBase)

	const z = maxZPosition - expValue * (maxZPosition - minZPosition)

	return z;
}
