import { Modal, Slide, Card, Box, Typography, IconButton } from '@mui/material'
import { globalVarContext } from '../Context/GlobalContext'
import CloseIcon from '@mui/icons-material/Close'
import { useContext } from 'react'

const EventModal = () => {
    const {
        selectedEventContext, setSelectedEventContext,
        isModalOpenContext,   setIsModalOpenContext,
    } = useContext(globalVarContext)

    const handleClose = () => {
        setIsModalOpenContext(false)
        setSelectedEventContext(null)
    }

    if (!selectedEventContext) return null

    return (
        <Modal
        open    = {isModalOpenContext}
        onClose = {handleClose}
        closeAfterTransition
        >
            <Box
            sx = {{
                width:   '100%',
                height:  '100%',
                display: 'flex',
                alignItems:     'center',
                justifyContent: 'center',
            }}
            >
                <Slide
                direction = 'down'
                in        = {isModalOpenContext}
                timeout   = {800}
                mountOnEnter
                unmountOnExit
                >
                    <Card
                    sx = {{
                        width:     { xs: '90%', md: '70%' },
                        maxWidth:  800,
                        maxHeight: 500,
                        height:    { xs: '90%', md: '70%' },
                        borderRadius: 4,
                        boxShadow:    10,
                        bgcolor:       '#f5f5f5',
                        overflow:      'hidden',
                        display:       'flex',
                        flexDirection: 'column',
                    }}
                    >
                        {/* Top bar with close */}
                        <Box
                        sx = {{
                            display:        'flex',
                            justifyContent: 'space-between',
                            alignItems:     'center',
                            p: 2,
                            borderBottom: '1px solid #ddd',
                        }}
                        >
                            <Typography variant = 'h6' sx = {{ fontWeight: 'bold' }}>
                                {selectedEventContext.title?.gr}
                            </Typography>

                            <IconButton onClick = {handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Modal content */}
                        <Box
                        sx = {{
                            flex: 1,
                            p:    3,
                            gap:  3,
                            overflowY:     'auto',
                            display:       'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            
                        }}
                        >
                            {/* Left: Text content */}
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
                                    color: '#333',
                                }}
                                >
                                    {selectedEventContext.startDate < 0
                                        ? `${Math.abs(selectedEventContext.startDate)} π.Χ.`
                                        : `${selectedEventContext.startDate} μ.Χ.`}
                                </Typography>
                            </Box>

                            {/* Right: Image or map or share */}
                            <Box
                            sx={{
                                flex: 1,
                                gap:  2,
                                display:       'flex',
                                flexDirection: 'column',
                            }}
                            >
                                <Box
                                sx = {{
                                    height:       150,
                                    bgcolor:      '#ccc',
                                    borderRadius: 2,
                                }}
                                >
                                {/* TODO: Add Image or Map here */}
                                </Box>

                                <Box sx = {{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                {/* TODO: Add share buttons if you want */}
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Slide>
            </Box>
        </Modal>
    )
}

export default EventModal;
