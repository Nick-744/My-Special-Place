import { step, spaceBetweenGObjs } from '../MyConfig'
import { eventsData } from '../InfoData/EventsData'

// Η Ζωή του Μ. Αλεξάνδρου | Μάχες και Πολιορκίες | Ίδρυση Πόλεων

// Offset each event group (section) on the X-axis to separate
// their paths visually! This prevents overlaps and keeps each
// section's path distinct. The offset is centered around zero.
const uniqueSections    = [...new Set(eventsData.map(e => e.section))]
const sectionsConstants = Object.fromEntries(
    uniqueSections.map((section, index) => [
        section, (index - Math.floor(uniqueSections.length / 2)) * step * spaceBetweenGObjs
    ])
)

const usedZPositions = new Map()
export function getNonOverlappingX(z, baseX, section) {
    const currentKey    = `${z}-${section}`

    const sectionOffset = sectionsConstants[section]
    let   returnX       = baseX + sectionOffset + (Math.random() - 0.5) * step * 1.8

    if (usedZPositions.has(currentKey)) {
        const existingX = usedZPositions.get(currentKey)
        let   distance  = Math.abs(existingX - returnX)

        // O(n!) implementation...
        while (distance < step * 0.6) {
            returnX  = baseX + sectionOffset + (Math.random() - 0.5) * step * 1.8
            distance = Math.abs(existingX - returnX)
        }

        usedZPositions.set(currentKey, returnX)
    }
    else
        usedZPositions.set(currentKey, returnX)

    return returnX;
}
