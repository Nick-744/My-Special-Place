import { Modal, Box, IconButton, Typography, Paper } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState, useEffect } from 'react'

const TextOverlay = ({ leftContent, rightContent, open, onClose }) => {
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setShowContent(true), 10)
            return () => clearTimeout(timer)
        }
        else setShowContent(false)
    }, [open])

    const handleClose = () => {
        setShowContent(false)
        setTimeout(() => onClose && onClose(), 300)
    }

    // Function to extract text from React elements
    const extractTextFromElement = (element) => {
        if (typeof element === 'string') return element;
        if (typeof element === 'number') return element.toString();
        if (!element || !element.props)  return '';
        
        let text = ''
        
        // Handle different element types
        if (element.type === 'h1' || element.type === 'h2' || element.type === 'h3' || element.type === 'h4') {
            const headerText = extractTextFromChildren(element.props.children)
            text += headerText + '\n\n'
        }
        else if (element.type === 'p') {
            text += extractTextFromChildren(element.props.children) + '\n\n'
        }
        else if (element.type === 'ul' || element.type === 'ol') {
            if (element.props.children) {
                const items = Array.isArray(element.props.children) ? element.props.children : [element.props.children]
                items.forEach((item) => {
                    if (item && item.type === 'li') {
                        text += `• ${extractTextFromChildren(item.props.children)}\n`
                    }
                })
            }
            text += '\n'
        }
        else if (element.type === 'blockquote') {
            text += `"${extractTextFromChildren(element.props.children)}"\n\n`
        }
        else if (element.type === 'img') {
            text += `[Image: ${element.props.alt || 'Image'}]\n\n`
        }
        else if (element.type === 'a') {
            text += `${extractTextFromChildren(element.props.children)} (${element.props.href || 'link'})\n`
        }
        else {
            text += extractTextFromChildren(element.props.children)
        }
        
        return text
    }

    const extractTextFromChildren = (children) => {
        if (!children) return ''
        
        if (typeof children === 'string') return children
        if (typeof children === 'number') return children.toString()
        
        if (Array.isArray(children)) {
            return children.map(child => extractTextFromElement(child)).join('')
        }
        
        return extractTextFromElement(children)
    }

    const extractAllText = (content) => {
        if (typeof content === 'string') return content
        
        // Handle Box components with style backgrounds
        if (content && content.props && content.props.sx && content.props.sx.background) {
            // Extract text from children of styled boxes
            return extractTextFromChildren(content.props.children)
        }
        
        return extractTextFromElement(content)
    }

    const leftText = leftContent ? extractAllText(leftContent) : ''
    const rightText = rightContent ? extractAllText(rightContent) : ''

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            hideBackdrop
        >
            <Box
                sx={{
                    backgroundColor: showContent ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
                    backdropFilter: showContent ? 'blur(8px)' : 'blur(0px)',
                    transition: 'backdrop-filter 300ms ease-in-out, background-color 300ms ease-in-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 1300,
                    opacity: showContent ? 1 : 0,
                    transform: showContent ? 'scale(1)' : 'scale(0.95)',
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        color: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.2)',
                        },
                        zIndex: 1301
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Main Content */}
                <Box
                    sx={{
                        width: '90%',
                        maxWidth: 1200,
                        height: '90%',
                        display: 'flex',
                        gap: 3,
                        p: 2
                    }}
                >
                    {/* Left Page */}
                    {leftText && (
                        <Paper
                            elevation={8}
                            sx={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    p: 2,
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    Left Page
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 3,
                                    overflow: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                        },
                                    },
                                }}
                            >
                                <Typography
                                    component="pre"
                                    sx={{
                                        fontFamily: '"Times New Roman", serif',
                                        fontSize: '16px',
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        color: '#333'
                                    }}
                                >
                                    {leftText}
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    {/* Right Page */}
                    {rightText && (
                        <Paper
                            elevation={8}
                            sx={{
                                flex: 1,
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    p: 2,
                                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    Right Page
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 3,
                                    overflow: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                        },
                                    },
                                }}
                            >
                                <Typography
                                    component="pre"
                                    sx={{
                                        fontFamily: '"Times New Roman", serif',
                                        fontSize: '16px',
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-wrap',
                                        wordWrap: 'break-word',
                                        color: '#333'
                                    }}
                                >
                                    {rightText}
                                </Typography>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Modal>
    )
}

export default TextOverlay;
