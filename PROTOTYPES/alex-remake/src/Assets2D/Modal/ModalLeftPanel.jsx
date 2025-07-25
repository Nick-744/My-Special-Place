import { Box, Typography, Link } from '@mui/material'

/*
Contains the left panel of the modal that
displays event details - Mostly text based.
*/
const ModalLeftPanel = ({ selectedEventContext }) => {
    const { location, description, startDate, referrals } = selectedEventContext

    const formattedLocation = location?.gr || 'Άγνωστη τοποθεσία'
    const formattedDate     = startDate < 0 ? `${Math.abs(startDate)} π.Χ.` : `${startDate} μ.Χ.`

    return (
        <Box
        sx = {{
            flex: 2,
            gap:  2,
            display:       'flex',
            flexDirection: 'column'
        }}
        >
            <Typography variant = 'subtitle1' sx = {{ color: 'gray' }}>
                {formattedLocation}
            </Typography>

            <Typography variant = 'body1' sx = {{ textAlign: 'justify' }}>
                {description?.gr}
            </Typography>

            <Typography variant = 'body2' sx = {{ fontStyle: 'italic', color: '#333' }}>
                {formattedDate}
            </Typography>

            {referrals && (
                <Box sx = {{ alignSelf: 'flex-end' }}>
                    <Link href = {referrals} target = '_blank' rel = 'noopener noreferrer'>
                        Περισσότερα
                    </Link>
                </Box>
            )}
        </Box>
    );
}

export default ModalLeftPanel;
