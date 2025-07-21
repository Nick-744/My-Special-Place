import { scaleEffect, cameraPos } from './MyConfig';

/** --- Calculate wave displacement for a given position and time ---
 *
 * @param {number} x    - X coordinate
 * @param {number} y    - Y coordinate
 * @param {number} time - Current time
 * @param {number} distanceFromCamera - Distance from camera position
 * @returns {number} Wave height at the given position
 */
export function getWaveHeight(x, y, time, distanceFromCamera) {
    // Waves get more intense farther from camera (Galaxy Video Technique).
    // Η βασική ιδέα είναι ότι θέλουμε πρακτικά 0 μεταβολή [κύματα] κοντά
    // στην κάμερα και να αυξάνεται η ένταση [εκθετικά] όσο απομακρυνόμαστε.
    const intensityMultiplier = Math.exp(distanceFromCamera) - 1;
    
    // Multiple wave patterns for complex surface
    const wave1  = Math.sin(x * 0.5 + time * 2) * 0.8;         // Primary sine wave
    const wave2  = Math.cos(y * 0.3 + time * 1.5) * 0.6;       // Perpendicular cosine wave
    const wave3  = Math.sin((x + y) * 0.2 + time * 0.8) * 1.2; // Diagonal interference wave
    const ripple = Math.sin(Math.sqrt(x*x + y*y) * 0.3 - time * 3) * 0.4; // Radial ripples
    
    return scaleEffect * (wave1 + wave2 + wave3 + ripple) * intensityMultiplier;
}

/** --- Calculates the distance from a given point (x, y) to the camera position ---
 *
 * The result is normalized by dividing by 50.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @returns {number} The normalized distance from the camera to the point.
 */
export const calculateDistanceFromCamera = (x, y) => {
    return Math.sqrt((x - cameraPos[0])**2 + (y - cameraPos[1])**2) / 50;
}
