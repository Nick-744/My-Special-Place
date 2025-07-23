import { Box, Typography } from '@mui/material'

/*
Contains the right panel of the modal that
displays event images and captions.
*/
const ModalRightPanel = ({ selectedEventContext }) => {
    return (
        <Box
        sx = {{
            flex: 1,
            gap:  2,
            display:       'flex',
            flexDirection: 'column',
        }}
        >
            <Box
            sx = {{
                height:         250,
                width:          '100%',
                minWidth:       200,
                maxWidth:       300,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     '#e0e0e0',
                borderRadius:   2,
                overflow:       'hidden',
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
                        borderRadius:   2,
                        background:     '#e0e0e0',
                    }}
                    />
                ) : (
                    <Typography
                    variant = 'body2'
                    sx      = {{ textAlign: 'center', paddingTop: 5 }}
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
                mt: 1,
            }}
            >
                {selectedEventContext.imageDescription?.gr || 'Χωρίς περιγραφή εικόνας.'}
            </Typography>
        </Box>
    );
}

export default ModalRightPanel;
