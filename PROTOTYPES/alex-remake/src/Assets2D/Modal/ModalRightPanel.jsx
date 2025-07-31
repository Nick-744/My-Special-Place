import { Box, Typography } from '@mui/material'

/*
Contains the right panel of the modal that
displays event images and captions.
*/
const ModalRightPanel = ({ selectedEventContext }) => {
    const borderRadius = 4

    return (
        <Box
        sx = {{
            flex: 1,
            gap:  { xs: 1.5, md: 2 },
            display:       'flex',
            flexDirection: { xs: 'row', md: 'column' }
        }}
        >
            {/* Image Box */}
            <Box
            sx = {{
                height:         { xs: 150, sm: 200, md: 250 },
                width:          '100%',
                minWidth:       { xs: 120, sm: 180, md: 200 },
                maxWidth:       { xs: 180, sm: 250, md: 300 },
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     '#e0e0e0',
                borderRadius:   borderRadius,
                overflow:       'hidden'
            }}
            >
                {selectedEventContext.image ? (
                    <img
                    src   = {selectedEventContext.image}
                    alt   = {selectedEventContext.title?.gr}
                    style = {{
                        display:        'block',
                        width:          '100%',
                        height:         '100%',
                        objectFit:      'cover',
                        objectPosition: 'top',
                        borderRadius:   borderRadius,
                        background:     '#e0e0e0'
                    }}
                    />
                ) : (
                    <Typography
                    variant = 'body2'
                    sx      = {{
                        textAlign:  'center',
                        paddingTop: { xs: 2, md: 5 },
                        fontSize:   { xs: '0.75rem', md: '0.875rem' }
                    }}
                    >
                        Δεν υπάρχει εικόνα διαθέσιμη.
                    </Typography>
                )}
            </Box>

            <Typography
            variant = 'caption'
            sx      = {{
                display:   'block',
                textAlign: 'left',
                color:     '#000000',
                fontStyle: 'italic',
                mt:        { xs: 0.5, md: 1 },
                fontSize:  { xs: '0.75rem', md: '0.875rem' }
            }}
            >
                {selectedEventContext.imageDescription?.gr || 'Χωρίς περιγραφή εικόνας.'}
            </Typography>
        </Box>
    );
}

export default ModalRightPanel;
