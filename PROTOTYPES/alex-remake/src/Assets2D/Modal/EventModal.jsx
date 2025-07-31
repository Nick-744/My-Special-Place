import { Modal, Slide, Card, Box, Typography, IconButton } from '@mui/material'
import { globalVarContext } from '../../Context/GlobalContext'
import { useContext, useState, useEffect } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ModalRightPanel from './ModalRightPanel'
import ModalLeftPanel from './ModalLeftPanel'

const EventModal = () => {
    const {
        selectedEventContext, setSelectedEventContext,
        isModalOpenContext,   setIsModalOpenContext,
    } = useContext(globalVarContext)

    const [showModalContent, setShowModalContent] = useState(false)

    useEffect(() => {
        if (isModalOpenContext) {
            // Small delay to allow the backdrop to render in its initial state first
            const timer = setTimeout(() => { setShowModalContent(true) }, 10)

            return () => clearTimeout(timer);
        }
    }, [isModalOpenContext])

    const handleClose = () => { setShowModalContent(false) }

    const handleExited = () => {
        setIsModalOpenContext(false)
        setSelectedEventContext(null)
    }

    // Only close if clicking the backdrop itself, not the content - [Could use only X to close...]
    const handleBackdropClick = (e) => { if (e.target === e.currentTarget) handleClose() }

    if (!selectedEventContext) return null;

    return (
        <Modal
        open    = {isModalOpenContext}
        onClose = {handleClose}
        closeAfterTransition
        hideBackdrop // Disable default backdrop [background overlay]
        >
            {/* --- Custom backdrop with smooth transitions --- */}
            <Box
            onClick = {handleBackdropClick}
            sx      = {{
                position: 'fixed',
                top:    0,
                left:   0,
                right:  0,
                bottom: 0,
                backgroundColor: showModalContent ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0)',
                backdropFilter:  showModalContent ? 'blur(4px)' : 'blur(0px)',
                transition:     'backdrop-filter 800ms ease-in-out, background-color 800ms ease-in-out',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                zIndex: -1 // Ensure it's behind the content
            }}
            >
                {/* Content container */}
                <Box
                sx = {{
                    width:   '100%',
                    height:  '100%',
                    display: 'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    pointerEvents:  'none' // Allow clicks to pass through to backdrop
                }}
                >
                    <Slide
                    direction = 'right'
                    in        = {showModalContent}
                    timeout   = {750}
                    mountOnEnter
                    unmountOnExit
                    onExited  = {handleExited}
                    >
                        <Card
                        sx = {{
                            width:     { xs: '95%', sm: '90%', md: '70%' },
                            height:    { xs: '85%', sm: '90%', md: '70%' },
                            maxWidth: { xs: '100%', sm: 500, md: 800 },
                            maxHeight: { xs: '100%', sm: 400, md: 500 },
                            borderRadius:  8,
                            bgcolor:       '#f5f5f5',
                            overflow:      'hidden',
                            display:       'flex',
                            flexDirection: 'column',
                            pointerEvents: 'auto' // Re-enable clicks on the card
                        }}
                        >
                            {/* Top bar with close */}
                            <Box
                            sx = {{
                                display:        'flex',
                                justifyContent: 'space-between',
                                alignItems:     'center',
                                p: 2,
                                borderBottom:   '1px solid #ddd'
                            }}
                            >
                                <Typography
                                variant = 'h6'
                                sx      = {{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.25rem' } }}
                                >
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
                                p:    { xs: 1.5, md: 3 },
                                gap:  { xs: 2, md: 3 },
                                overflowY: 'auto',
                                display:   'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                            }}
                            >

                                {/* Left: Text content */}
                                <ModalLeftPanel selectedEventContext={selectedEventContext} />

                                {/* Right: Image and caption */}
                                <ModalRightPanel selectedEventContext={selectedEventContext} />

                            </Box>
                        </Card>
                    </Slide>
                </Box>
            </Box>
        </Modal>
    );
}

export default EventModal;
