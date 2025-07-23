import { step } from '../MyConfig'

// ----- Positioning Logic/Pattern ----- //
const Z_BUCKET_SIZE = step * 2
function getZBucket(z) { return Math.round(z / Z_BUCKET_SIZE) * Z_BUCKET_SIZE; }

const usedXPerZ = new Map()
export function getNonOverlappingX(z, baseX, buffer = step * 0.2, maxAttempts = 30) {
    const bucketZ = getZBucket(z)
    if (!usedXPerZ.has(bucketZ)) usedXPerZ.set(bucketZ, [])
    const usedX   = usedXPerZ.get(bucketZ)

    // Try spreading X left and right from baseX in a predictable pattern
    for (let i = 0; i < maxAttempts; i++) {
        const offset = ((i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2)) * buffer
        const tryX   = baseX + offset + (Math.random() - 0.5) * 5;

        const collides = usedX.some(x => Math.abs(x - tryX) < buffer)
        if (!collides) {
            usedX.push(tryX)

            return tryX;
        }
    }

    // Fallback: add random jitter if no spot found after all attempts
    const fallbackX = baseX + (Math.random() - 0.5) * buffer
    usedX.push(fallbackX)

    return fallbackX;
}
