import {
	PaginationItem,
	Pagination,
	IconButton,
	Tooltip,
	Button,
	Box
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { usePages } from '../InfoData/PagesContent'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

// Atom to manage the current page state:
export const pageAtom = atom(0)

const UI = ({
	mobileView,
	
	onShowTextOverlay,
	currentLeftContent,
	currentRightContent,
	
	handleCameraReset
}) => {
	const { pages, _ } = usePages()

	const [page, setPage] = useAtom(pageAtom)

	const handlePrevious  = () => setPage(Math.max(0, page - 1))
	const handleNext      = () => setPage(Math.min(pages.length, page + 1))
	
	// Clamp current page when pages length changes (avoid out-of-range)!
	useEffect(() => { if (page > pages.length) setPage(pages.length) }, [pages.length])

	const hasTextContent  = (currentLeftContent || currentRightContent)

	return (
		<>
			{/* Pages Navigation Controls */}
			<Box
			position     = 'fixed'
			bottom       = {20}
			right        = {mobileView ? '50%' : 20}
			display      = 'flex'
			alignItems   = 'center'
			bgcolor      = 'rgba(255, 255, 255, 0.9)'
			borderRadius = {4}
			p   = {2}
			gap = {1}
			boxShadow    = '0 8px 32px rgba(0, 0, 0, 0.12)'
			sx           = {{ transform: mobileView ? 'translate(50%)' : 'none' }}
			>
				<Tooltip title = 'Προηγούμενη σελίδα' placement = 'top'>
					<span>
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
					</span>
				</Tooltip>

				<Box
				display       = 'flex'
				flexDirection = 'column'
				alignItems    = 'center'
				sx            = {{ minWidth: 200 }}
				>
					<Pagination
					count    = {pages.length + 1}
					page     = {page + 1}
					onChange = {(_, value) => setPage(value - 1)}
					color    = 'primary'

					size          = {mobileView ? 'small' : 'medium'}
					boundaryCount = {mobileView ? 1       : 2       }
					siblingCount  = {1}
					renderItem    = {(item) => {
						// Hide built-in previous/next buttons so we can use custom ones!
						if (item.type === 'previous' || item.type === 'next') return null;

						return <PaginationItem {...item} />;
					}}
					
					sx = {{ width: '100%', display: 'flex', justifyContent: 'center' }}
					/>
				</Box>

				<Tooltip title = 'Επόμενη σελίδα' placement = 'top'>
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
				<Tooltip title = 'Προβολή κειμένου' placement = 'left'>
					<Button
					variant = 'contained'
					onClick = {onShowTextOverlay}
					sx      = {{
						position: 'fixed',
						top:      mobileView ? 30 : 'auto',
						bottom:   mobileView ? 'auto' : 30,
						left:     30,
						minWidth: 'auto',
						width:    60,
						height:   60,
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

			{/* Camera Reset Button */}
            {!mobileView && (
                <Tooltip title = 'Επαναφορά θέσης κάμερας' placement = 'left'>
                    <Button
					variant = 'contained'
					onClick = {handleCameraReset}
					sx      = {{
						position: 'fixed',
						top:      30,
						right:    30,
						minWidth: 'auto',
						width:    60,
						height:   60,
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
                        <CameraAltIcon sx = {{ color: 'white' }} />
                    </Button>
                </Tooltip>
            )}
		</>
	);
}

export default UI;
