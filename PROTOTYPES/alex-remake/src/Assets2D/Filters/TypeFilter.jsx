import { originalColor } from '../../MyConfig'

import FilterToggleArrow from './CustomArrow'
import GenericFilter from './GenericFilter'

const TypeFilter = ({ eventRefs, eventIconRefs }) => {
    return (
        <GenericFilter
        filterKey      = 'type'
        eventRefs      = {eventRefs}
        eventIconRefs  = {eventIconRefs}
        getColor       = {(_, event) => originalColor[event?.section] || '#999999'}
        positionConfig = {(globalVar, isOpen) => ({
            bottom: globalVar.mobileViewContext ? 'auto' : '10px',
            top:    globalVar.mobileViewContext ? '10px' : 'auto',
            left:   globalVar.mobileViewContext ? (isOpen ? '10px' : '-235px') : '-205px',
            ...(globalVar.mobileViewContext     ? {} : {'&:hover': { left: '10px' }})
        })}

        customArrow = {({ isOpen, setIsOpen, mobile }) => (
            <FilterToggleArrow
                isOpen     = {isOpen}
                setIsOpen  = {setIsOpen}
                mobile     = {mobile}
                showAlways = {true}
                direction  = 'horizontal'
                position   = {{ top: '50%', right: '-25px' }}
            />
        )}
        />
    );
}

export default TypeFilter;
