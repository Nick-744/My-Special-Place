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
            gap:  { xs: 1.5, md: 2 },
            display:       'flex',
            flexDirection: 'column'
        }}
        >
            <Typography
            variant = 'subtitle1'
            sx      = {{
                color:    'gray',
                fontSize: { xs: '0.9rem', md: '1rem' }
            }}
            >
                {formattedLocation}
            </Typography>

            <Typography
            variant = 'body1'
            sx      = {{
                textAlign: 'justify',
                fontSize:  { xs: '0.85rem', md: '1rem' }
            }}
            >
                {description?.gr}
            </Typography>

            <Typography
            variant = 'body2'
            sx = {{
                fontStyle: 'italic',
                color: '#333',
                fontSize: { xs: '0.75rem', md: '0.875rem' }
            }}
            >
                {formattedDate}
            </Typography>

            {referrals && (
                <Box sx = {{ alignSelf: 'flex-end' }}>
                    <Link
                    href   = {referrals}
                    target = '_blank'
                    rel    = 'noopener noreferrer'
                    sx     = {{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                    >
                        Περισσότερα
                    </Link>
                </Box>
            )}
        </Box>
    );
}

export default ModalLeftPanel;
