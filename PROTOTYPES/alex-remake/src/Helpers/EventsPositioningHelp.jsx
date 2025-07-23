import { step } from '../MyConfig'

/** ----- Positioning Logic/Pattern -----
 * 
 * Calculates a non-overlapping X position for a given Z value, ensuring that
 * the returned X does not collide with previously used X positions at the same Z bucket.
 *
 * @param {number} z                     - The Z coordinate used to determine the bucket for X positions.
 * @param {number} baseX                 - The base X coordinate to offset from.
 * @param {number} [buffer             ] - The minimum distance required between X positions to avoid overlap.
 * @param {number} [maxAttempts    = 30] - The maximum number of attempts to find a non-overlapping X.
 * @param {number} [numOffsetTypes =  4] - The number of offset types to try for spreading out positions.
 * 
 * @returns {number} A non-overlapping X coordinate near the baseX for the given Z bucket.
 */

const Z_BUCKET_SIZE = step * 2
function getZBucket(z) { return Math.round(z / Z_BUCKET_SIZE) * Z_BUCKET_SIZE; }

const usedXPerZ = new Map()
export function getNonOverlappingX(
    z, baseX, buffer = step * 0.15, maxAttempts = 30, numOffsetTypes = 5
) {
    const bucketZ     = getZBucket(z)
    if (!usedXPerZ.has(bucketZ)) usedXPerZ.set(bucketZ, [])
    const usedX       = usedXPerZ.get(bucketZ)
    const typeSpacing = buffer * numOffsetTypes // spacing between types

    for (let i = 0; i < maxAttempts; i++) {
        const typeIndex = i % numOffsetTypes
        const group     = Math.floor(i / numOffsetTypes)
        const direction = group % 2 === 0 ? 1 : -1 // alternate left/right

        const offset = direction * (group + 1) * typeSpacing + typeIndex * buffer
        const tryX   = baseX + offset + (Math.random() - 0.5) * 5

        const collides = usedX.some(x => Math.abs(x - tryX) < buffer)
        if (!collides) {
            usedX.push(tryX)

            return tryX;
        }
    }

    // --- Fallback ---
    const fallbackX = baseX + (Math.random() - 0.5) * buffer
    usedX.push(fallbackX)

    return fallbackX;
}
