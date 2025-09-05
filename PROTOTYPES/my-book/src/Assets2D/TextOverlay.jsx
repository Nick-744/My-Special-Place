import { Box, IconButton, Typography, Fade, Tooltip } from '@mui/material'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useState, useEffect, useRef } from 'react'
import CloseIcon from '@mui/icons-material/Close'

const TextOverlay = ({ leftContent, rightContent, open, onClose }) => {
    const [showContent, setShowContent] = useState(false)
    const [speaking,    setSpeaking   ] = useState(false)
    const synthRef                      = useRef(window.speechSynthesis)

    /* When open is true, the code sets a short timer (10 milliseconds)
    before calling setShowContent(true). This slight delay can help
    trigger CSS transitions or animations by ensuring the
    component has mounted before showing content. */
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setShowContent(true), 10)

            return () => clearTimeout(timer);
        }
        setShowContent(false)
    }, [open])

    // Handle closing the overlay
    const handleClose = () => {
        setShowContent(false)
        setTimeout(() => onClose && onClose(), 300)
        handleStopSpeech()
    }

    // Extract text from React elements - Basically the same as in TextPage.jsx!
    // [Can be combined later...]
    const extractText = (element) => {
        if (typeof element === 'string') return element;
        if (typeof element === 'number') return element.toString();
        if (!element?.props)             return '';

        let   text     = ''
        const children = element.props.children

        // Handle different element types
        if      (element.type === 'h1' ) text += extractChildren(children) + '\n\n'
        else if (element.type === 'p'  ) text += extractChildren(children) + '\n\n'
        else if (element.type === 'img') text += '[Εικόνα]\n\n'
        else                             text += extractChildren(children)

        return text;
    }

    const extractChildren = (children) => {
        if (!children)                    return '';
        if (typeof children === 'string') return children;
        if (typeof children === 'number') return children.toString();
        if (Array.isArray(children))      return children.map(child => extractText(child)).join('');

        return extractText(children);
    }

    const extractAllText = (content) => {
        if (typeof content === 'string')    return content;
        if (content?.props?.sx?.background) return extractChildren(content.props.children);

        return extractText(content);
    }

    const leftText  = leftContent  ? extractAllText(leftContent)  : ''
    const rightText = rightContent ? extractAllText(rightContent) : ''

    // --- Text-to-Speech functions --- //
    const handleSpeak = (text) => {
        if (!text) return;

        handleStopSpeech()
        const utter   = new window.SpeechSynthesisUtterance(text)
        utter.onend   = () => setSpeaking(false)
        utter.onerror = () => setSpeaking(false)
        synthRef.current.speak(utter)
        setSpeaking(true)
    }

    const handleStopSpeech = () => {
        if (synthRef.current?.speaking) {
            synthRef.current.cancel()
            setSpeaking(false)
        }
    }

    // Show a message when there's nothing to display!
    const nothingToDisplay = !leftText && !rightText

    const PageSection = ({ text, title }) => (
        <Box sx = {{ flex: 1, minWidth: 0 }}>
            <Box sx = {{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <Tooltip title = {speaking ? 'Διακοπή ανάγνωσης' : 'Ανάγνωση με φωνή'}>
                    <IconButton
                    onClick = {() => speaking ? handleStopSpeech() : handleSpeak(text)}
                    sx      = {{
                        bgcolor:   speaking            ? '#f44336' : '#2196f3',
                        color:     'white',
                        '&:hover': { bgcolor: speaking ? '#d32f2f' : '#1976d2' }
                    }}
                    >
                        <VolumeUpIcon />
                    </IconButton>
                </Tooltip>

                <Typography
                variant = 'h5'
                sx      = {{
                    color:         '#fff',
                    fontWeight:    'bold',
                    fontFamily:    'Arial',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    textShadow:    '2px 2px 4px rgba(0, 0, 0, 0.8)'
                }}
                >
                    {title}
                </Typography>
            </Box>

            <Typography
            component = 'pre'
            sx        = {{
                fontFamily: 'Arial',
                fontSize:   '18px',
                lineHeight: 1.6,
                color:      '#fff',
                whiteSpace: 'pre-wrap',
                wordBreak:  'break-word',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}
            >
                {text}
            </Typography>
        </Box>
    )

    return (
        <Fade in = {open && showContent} timeout = {1000}>
            <Box
            sx = {{
                position:       'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex:         100,
                background:     'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(3px)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                pointerEvents:  open ? 'auto' : 'none'
            }}
            >
                <Box
                sx = {{
                    position:      'relative',
                    width:         { xs: '95vw',   md: 900, sm: 600 },
                    maxHeight:     '90vh',
                    borderRadius:  2,
                    p:             { xs: 3,        md: 6            },
                    overflow:      'auto',
                    display:       'flex',
                    flexDirection: { xs: 'column', md: 'row'        },
                    gap:           { xs: 3, md: 6 },
                    opacity:       showContent ? 1 : 0,
                    transition:    'opacity 1200ms ease-out'
                }}
                >
                    {/* --- Close Button --- */}
                    <IconButton
                    onClick = {handleClose}
                    sx      = {{
                        position:  'absolute',
                        top:       16,
                        right:     16,
                        color:     'white',
                        '&:hover': { bgcolor: 'rgba(255, 0, 0, 1)' },
                        zIndex:    10
                    }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {nothingToDisplay ? (
                        <Box sx = {{ width: '100%', textAlign: 'center', py: 8 }}>
                            <Typography
                            variant = 'h4'
                            sx      = {{
                                color:      '#fff',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                            }}
                            >
                                Δεν υπάρχει περιεχόμενο προς εμφάνιση
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {/* --- Left Page --- */}
                            {leftText  && <PageSection text = {leftText}  title = 'ΑΡΙΣΤΕΡΗ ΣΕΛΙΔΑ' />}

                            {/* --- Right Page --- */}
                            {rightText && <PageSection text = {rightText} title = 'ΔΕΞΙΑ ΣΕΛΙΔΑ' />}
                        </>
                    )}
                </Box>
            </Box>
        </Fade>
    );
}

export default TextOverlay;
