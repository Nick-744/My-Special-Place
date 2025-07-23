import { Box, Typography } from '@mui/material'

/*
Contains the left panel of the modal that
displays event details - Mostly text based.
*/
const ModalLeftPanel = ({ selectedEventContext }) => {
    return (
        <Box sx = {{ flex: 2 }}>
            <Typography variant = 'subtitle1' sx = {{ mb: 1, color: 'gray' }}>
                {selectedEventContext.location?.gr || 'Άγνωστη τοποθεσία'}
            </Typography>

            <Typography variant = 'body1' sx = {{ mb: 2, textAlign: 'justify' }}>
                {selectedEventContext.description?.gr}
            </Typography>

            <Typography
            variant = 'body2'
            sx      = {{
                fontStyle: 'italic',
                color:     '#333',
            }}
            >
                {selectedEventContext.startDate < 0
                    ? `${Math.abs(selectedEventContext.startDate)} π.Χ.`
                    : `${selectedEventContext.startDate} μ.Χ.`}
            </Typography>
        </Box>
    );
}

export default ModalLeftPanel;
