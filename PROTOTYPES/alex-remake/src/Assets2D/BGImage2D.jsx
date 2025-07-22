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
			backgroundImage:
				'url(./Assets/ImageData/aleksander_background.png)',
			backgroundSize:     'cover',
			backgroundPosition: 'center top',
			backgroundRepeat:   'no-repeat',
			
			position: 'absolute',
			width:    '100%',
			height:   '52vh',
			top:  -50,
			left: 0,
			
			opacity:   0,
			animation: `${fadeIn} 2s forwards`,
		}}
		/>
	);
}

export default BackgroundImage;
