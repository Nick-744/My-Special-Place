const FilterToggleArrow = ({
    isOpen,
    setIsOpen,
    mobile,
    showAlways = false,
    direction  = 'horizontal', // 'vertical' for rotated arrow
    position   = {},           // allows passing { top, right, bottom, left }
    style      = {},           // custom overrides
}) => {
    if (!mobile && !showAlways) return null;

    const isVertical = direction === 'vertical'
    const transform  = isVertical ? 'translateY(-50%) rotate(90deg)' : 'translateY(-50%)'

    return (
        <div
        style = {{
            position: 'absolute',
            padding:  '0px 6px 5px 5px',
            color:           '#5f5f5f',
            backgroundColor: '#fafafa',
            borderTopRightRadius:    '7px',
            borderBottomRightRadius: '7px',
            fontWeight: 'bold',
            fontSize:   '30px',
            cursor:     'pointer',
            zIndex:     1000,
            transform,
            ...position,
            ...style,
        }}
        onClick = {() => mobile && setIsOpen(!isOpen)}
        >
            {isOpen ? '«' : '»'}
        </div>
    );
}

export default FilterToggleArrow;
