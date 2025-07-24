import { eventsData } from '../InfoData/EventsData'
import { step } from '../MyConfig'

const uniqueSections   = [...new Set(eventsData.map(e => e.section))]
const sectionConstants = Object.fromEntries(
    uniqueSections.map((section, index) => [
        section, (index - Math.floor(uniqueSections.length / 2)) * step * 2.2
    ])
)

export function getNonOverlappingX(z, baseX, section) {
    const sectionOffset = sectionConstants[section]


    return baseX + sectionOffset + (Math.random() - 0.5) * step * 1.8;
}
