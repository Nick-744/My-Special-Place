import { step } from '../MyConfig'

// ----- Positioning Logic/Pattern ----- //
const Z_BUCKET_SIZE = step * 2
function getZBucket(z) { return Math.round(z / Z_BUCKET_SIZE) * Z_BUCKET_SIZE; }

const usedXPerZ = new Map()
export function getNonOverlappingX(
    z, baseX, buffer = step * 0.1, maxAttempts = 30, numOffsetTypes = 4
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
