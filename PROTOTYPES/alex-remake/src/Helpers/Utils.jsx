import { scaleEffect, cameraPos, minZPosition, maxZPosition } from '../MyConfig';



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



// ========= TIMELINE SEGMENTS WITH RELATIVE LENGTHS ========= //

// These are *relative weights*, not absolute Z distances!!!
const timelineSegments = [
  { from: -360, to: -320, weight: 100}, // Cluster of events
  { from: -320,  to: 1600, weight: 20  }, // 2 events
  { from: 1600, to: 2020, weight: 50 }  // Cluster of events
]

// === NORMALIZE SEGMENTS TO FIT EXACTLY WITHIN Z RANGE ===
const totalWeight = timelineSegments.reduce((sum, seg) => sum + seg.weight, 0)
const fullZSpan   = maxZPosition - minZPosition

// Precompute absolute zLengths that perfectly fit within minZ → maxZ
const normalizedSegments = timelineSegments.map(seg => ({
  ...seg, zLength: (seg.weight / totalWeight) * fullZSpan
}))

/**
 * Calculates the Z position of an event based on its year, using normalized segments.
 * The function iterates through predefined segments, each with a range of years and a Z-length,
 * and determines the Z position for the given year. If the year falls outside all segments,
 * the position is clamped to the minimum or maximum Z position.
 *
 * @param {number} year - The year for which to calculate the Z position.
 * 
 * @returns {number}      The calculated Z position for the event.
 */
export function calculateEventZPosition(year) {
  let accumulatedZ = maxZPosition // Start at the front (camera side)

  for (const seg of normalizedSegments) {
    const { from, to, zLength } = seg

    if (year >= from && year <= to) {
      const t = (year - from) / (to - from) // normalized position in segment
      const z = accumulatedZ - t * zLength

      return z;
    }

    accumulatedZ -= zLength
  }

  // If outside all segments, clamp within bounds
  return (year < normalizedSegments[0].from
    ? maxZPosition
    : minZPosition);
}
