import { originalColor } from '../../MyConfig'

import { globalVarContext } from '../../Context/GlobalContext'
import FilterToggleArrow from './CustomArrow'
import GenericFilter from './GenericFilter'
import {useContext} from 'react'

const TypeFilter = ({ eventRefs, eventIconRefs }) => {
    // ----- Global ----- //
    const globalVar = useContext(globalVarContext)
    
    return (
        <GenericFilter
        filterKey      = 'type'
        eventRefs      = {eventRefs}
        eventIconRefs  = {eventIconRefs}
        getColor       = {(_, event) => originalColor[event?.section] || '#999999'}
        positionConfig = {(globalVar, isOpen) => ({
            bottom: globalVar.mobileViewContext ? 'auto' : '10px',
            top:    globalVar.mobileViewContext ? (isOpen ? '10px' : '-210px') : 'auto',
            left:   globalVar.mobileViewContext ? 'auto' : '-205px',
            right:  globalVar.mobileViewContext ? '10px' : 'auto',
            ...(globalVar.mobileViewContext     ? {} : {'&:hover': { left: '10px' }})
        })}

        customArrow = {({ isOpen, setIsOpen, mobile }) => (
            <FilterToggleArrow
            isOpen     = {isOpen}
            setIsOpen  = {setIsOpen}
            mobile     = {mobile}
            showAlways = {true}
            direction  = {globalVar.mobileViewContext
                ? 'vertical'
                : 'horizontal'
            }
            position   = {globalVar.mobileViewContext
                ? { bottom: '-51px', left:  '45%'   }
                : { top:      '50%', right: '-25px' }
            }
            />
        )}
        />
    );
}

export default TypeFilter;
