import { Modal, Slide, Card, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'

const ModalImage = ({ imageSrc, open, onClose }) => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setShowContent(true), 10)

            return () => clearTimeout(timer);
        }
        else setShowContent(false)
    }, [open])

    const handleClose  = () => setShowContent(false)
    const handleExited = () => onClose && onClose()

    return (
        <Modal
        open    = {open}
        onClose = {handleClose}
        closeAfterTransition
        hideBackdrop
        >
            <Box
            sx = {{
                backgroundColor: showContent
                                    ? 'rgba(0, 0, 0, 0.6)'
                                    : 'rgba(0, 0, 0, 0)',
                backdropFilter:  showContent ? 'blur(3px)' : 'blur(0px)',
                transition:      'backdrop-filter 800ms, background-color 800ms',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',

                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,

                zIndex: -1
            }}
            >
                <Box
                sx = {{
                    width:          '100%',
                    height:         '100%',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    pointerEvents:  'none'
                }}
                >
                    <Slide
                    direction = 'right'
                    in        = {showContent}
                    timeout   = {750}
                    mountOnEnter
                    unmountOnExit
                    onExited  = {handleExited}
                    >
                        <Card
                        sx = {{
                            width:         { xs: '95%',  md: '60%', sm: '80%' },
                            maxWidth:      { xs: '100%', md: 800,   sm: 500   },
                            height:        '90%',
                            borderRadius:  6,
                            bgcolor:       '#f5f5f5',
                            overflow:      'hidden',
                            display:       'flex',
                            flexDirection: 'column',
                            pointerEvents: 'auto'
                        }}
                        >
                            <Box
                            sx = {{
                                display:        'flex',
                                justifyContent: 'flex-end',
                                alignItems:     'center',
                                p: 1,
                                borderBottom:   '1px solid #ddd'
                            }}
                            >
                                <IconButton onClick = {handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            
                            <Box
                            sx = {{
                                flex: 1,
                                display:        'flex',
                                alignItems:     'center',
                                justifyContent: 'center',
                                bgcolor:        '#e0e0e0',
                                minHeight:      { xs: 200, md: 400, sm: 300 }
                            }}
                            >
                                <img
                                src   = {imageSrc}
                                alt   = 'Modal'
                                style = {{
                                    maxWidth:     '100%',
                                    maxHeight:    '100%',
                                    width:        'auto',
                                    height:       'auto',
                                    objectFit:    'contain',
                                    borderRadius: 4,
                                    background:   '#e0e0e0',
                                    display:      'block'
                                }}
                                />
                            </Box>
                        </Card>
                    </Slide>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalImage;
