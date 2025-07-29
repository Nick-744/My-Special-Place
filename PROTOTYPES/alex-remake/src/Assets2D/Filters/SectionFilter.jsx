import { originalColor } from '../../MyConfig'

import { globalVarContext } from '../../Context/GlobalContext'
import FilterToggleArrow from './CustomArrow'
import RotatingFilter from './CarouselFilter'
import GenericFilter from './GenericFilter'
import {useContext} from 'react'

const SectionFilter = ({ eventRefs, eventIconRefs }) => {
    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)

    return (
        globalVar.mobileViewContext
        ? <RotatingFilter
        eventRefs      = {eventRefs}
        eventIconRefs  = {eventIconRefs}
        filterKey      = 'section'
        getColor       = {(section) => originalColor[section] || '#ffff00'}
        />
        : <GenericFilter
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
            position  = {{ bottom: '-51px', left: '46%' }}
            />
        )}
        />
    );
}

export default SectionFilter;
