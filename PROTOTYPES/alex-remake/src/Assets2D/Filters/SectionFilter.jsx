import { originalColor } from '../../MyConfig'

import { globalVarContext } from '../../Context/GlobalContext'
import FilterToggleArrow from './CustomArrow'
import GenericFilter from './GenericFilter'
import {useContext} from 'react'

const SectionFilter = ({ eventRefs, eventIconRefs }) => {
    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)

    return (
        <GenericFilter
        filterKey      = 'section'
        eventRefs      = {eventRefs}
        eventIconRefs  = {eventIconRefs}
        getColor       = {(section) => originalColor[section] || '#ffff00'}
        positionConfig = {(globalVar, isOpen) => ({
            // bottom
            top:  globalVar.mobileViewContext ? (isOpen ? '10px' : '-210px') : '30px',
            left: globalVar.mobileViewContext ? '10px' : '30px',
            ...(globalVar.mobileViewContext   ? {} : {'&:hover': { transform: 'scale(1.03)' }})
        })}

        customArrow = {({ isOpen, setIsOpen, mobile }) => (
            <FilterToggleArrow
            isOpen    = {isOpen}
            setIsOpen = {setIsOpen}
            mobile    = {mobile}
            // showAlways = {false}
            direction = 'vertical'
            position  = {{ bottom: '-51px', left: '45%' }}
            />
        )}

        // Only 1 section can be active at a time in mobile view!
        onlyOneActive = {globalVar.mobileViewContext}
        />
    );
}

export default SectionFilter;
