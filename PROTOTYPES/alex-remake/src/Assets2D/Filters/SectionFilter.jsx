import { originalColor } from '../../MyConfig'

import FilterToggleArrow from './CustomArrow'
import GenericFilter from './GenericFilter'

const SectionFilter = ({ eventRefs, eventIconRefs }) => {
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
                position  = {{ bottom: '-51px', left: '46%' }}
            />
        )}
        />
    );
}

export default SectionFilter;
