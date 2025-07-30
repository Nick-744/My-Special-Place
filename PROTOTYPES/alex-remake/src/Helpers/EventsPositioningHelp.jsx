import { step, spaceBetweenGObj, gObjPathWidth } from '../MyConfig'
import { globalVarContext } from '../Context/GlobalContext'
import { eventsData } from '../InfoData/EventsData'
import {useContext} from 'react'

// Η Ζωή του Μ. Αλεξάνδρου | Μάχες και Πολιορκίες | Ίδρυση Πόλεων | Πολιτισμικό αποτύπωμα

// Offset each event group (section) on the X-axis to separate
// their paths visually! This prevents overlaps and keeps each
// section's path distinct. The offset is centered around zero.
const uniqueSections    = [...new Set(eventsData.map(e => e.section))]
const sectionsConstants = Object.fromEntries(
    uniqueSections.map((section, index) => [
        section, (index - Math.floor(uniqueSections.length / 2)) * step * spaceBetweenGObj
    ])
)

// --- Helpers ---
const getRandomX = (baseX, section, mobileViewContext) => {
    const randomOffset = (Math.random() - 0.5) * step * gObjPathWidth / 2

    if (mobileViewContext) return randomOffset; // For mobile, return only the random offset!

    const sectionOffset = sectionsConstants[section]

    return baseX + sectionOffset + randomOffset;
}

const usedZPositions = new Map()
/**
 * Returns a non-overlapping X position for a given Z and section.
 * Ensures that the generated X position does not overlap with previously used positions
 * for the same Z and section combination.
 *
 * @param {number} z       - The Z coordinate or identifier.
 * @param {number} baseX   - The base X position to start from.
 * @param {string} section - The section identifier.
 * 
 * @returns {number} A non-overlapping X position.
 */
export function getNonOverlappingX(z, baseX, section, mobileViewContext) {
    const currentKey = `${z}-${section}`

    let   returnX    = getRandomX(baseX, section, mobileViewContext)
    if (usedZPositions.has(currentKey)) {
        const existingX = usedZPositions.get(currentKey)
        let   distance  = Math.abs(existingX - returnX)

        // O(n!) implementation...
        while (distance < step * gObjPathWidth / 5) {
            returnX  = getRandomX(baseX, section, mobileViewContext)
            distance = Math.abs(existingX - returnX)
        }

        usedZPositions.set(currentKey, returnX);
    }
    else
        usedZPositions.set(currentKey, returnX);

    return returnX;
}
