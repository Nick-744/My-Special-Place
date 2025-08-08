import {
	IconButton,
	Typography,
	Tooltip,
	Button,
	Slider, 
	Box
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import { pages } from '../InfoData/PagesContent'
import { atom, useAtom } from 'jotai'

// Atom to manage the current page state:
export const pageAtom = atom(0)

const UI = ({ onShowTextOverlay, currentLeftContent, currentRightContent }) => {
	const [page, setPage] = useAtom(pageAtom)

	const handlePrevious  = () => setPage(Math.max(0, page - 1))
	const handleNext      = () => setPage(Math.min(pages.length, page + 1))

	const hasTextContent  = (currentLeftContent || currentRightContent)

	return (
		<>
			{/* Navigation Controls */}
			<Box
			position   = 'fixed'
			bottom     = {20}
			right      = {20}
			display    = 'flex'
			gap        = {2}
			alignItems = 'center'
			bgcolor    = 'rgba(255, 255, 255, 0.9)'
			borderRadius   = {4}
			p = {2}
			boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)'
			>
				<Tooltip title = 'Previous Page' placement = 'top'>
					<IconButton 
					onClick  = {handlePrevious}
					disabled = {page === 0}
					sx       = {{
						bgcolor:   page === 0 ? 'transparent' : 'primary.main',
						color:     page === 0 ? 'text.disabled' : 'white',
						'&:hover': { bgcolor: page === 0 ? 'transparent' : 'primary.dark' }
					}}
					>
						<ChevronLeftIcon />
					</IconButton>
				</Tooltip>

				<Box
				display       = 'flex'
				flexDirection = 'column'
				alignItems    = 'center'
				sx            = {{ minWidth: 200 }}
				>
					<Typography variant = 'body2' color = 'text.secondary' mb = {1}>
						Page {page} of {pages.length}
					</Typography>

					<Slider
					value    = {page}
					onChange = {(_, newValue) => setPage(newValue)}
					min      = {0}
					max      = {pages.length}
					step     = {1}
					sx       = {{ width: '100%' }}
					/>
				</Box>

				<Tooltip title = 'Next Page' placement = 'top'>
					<IconButton 
					onClick  = {handleNext}
					disabled = {page === pages.length}
					sx       = {{
						bgcolor:   page === pages.length ? 'transparent' : 'primary.main',
						color:     page === pages.length ? 'text.disabled' : 'white',
						'&:hover': {
							bgcolor: page === pages.length ? 'transparent' : 'primary.dark',
						}
					}}
					>
						<ChevronRightIcon />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Text Overlay Button */}
			{hasTextContent && (
				<Tooltip title = 'View Text Only' placement = 'left'>
					<Button
					variant = 'contained'
					onClick = {onShowTextOverlay}
					sx      = {{
						position: 'fixed',
						top:  30,
						left: 30,
						minWidth: 'auto',
						width:  56,
						height: 56,
						borderRadius:    '50%',
						backgroundColor: 'rgba(25, 118, 210, 0.9)',
						backdropFilter:  'blur(10px)',
						boxShadow:       '0 8px 32px rgba(0, 0, 0, 0.12)',
						'&:hover': {
							backgroundColor: 'rgba(25, 118, 210, 1)',
							transform:       'scale(1.05)',
						},
						transition: 'all 0.3s ease-in-out'
					}}
					>
						<TextFieldsIcon sx = {{ color: 'white' }} />
					</Button>
				</Tooltip>
			)}
		</>
	);
}

export default UI;
