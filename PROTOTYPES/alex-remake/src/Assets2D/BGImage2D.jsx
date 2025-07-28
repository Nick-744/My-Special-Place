import { Box, keyframes } from '@mui/material'

const BackgroundImage = () => {
	const fadeIn = keyframes`
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}`;

	return (
		<Box
		sx = {{
			backgroundImage:    'url(./Assets/ImageData/aleksander_background.jpg)',
			backgroundSize:     'cover',
			backgroundPosition: 'center top',
			backgroundRepeat:   'no-repeat',
			
			position: 'absolute',
			width:    '100%',
			height:   '45vh',
			top:  -30,
			left: 0,
			
			opacity:   0,
			animation: `${fadeIn} 2s forwards`,

			// Gradient mask using WebKit (works in Chrome, Edge, Safari)
			WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))',
			maskImage:       'linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))'
		}}
		/>
	);
}

export default BackgroundImage;
