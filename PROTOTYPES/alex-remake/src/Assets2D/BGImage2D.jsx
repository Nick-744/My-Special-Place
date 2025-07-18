import { Box } from '@mui/material'

const BackgroundImage = () => {
  return (
    <Box
      sx = {{
        backgroundImage:
        `
        
        url(./Assets/ImageData/aleksander_background2D.jpg)
        `,
        backgroundSize:     'cover',
        backgroundPosition: 'center top',
        backgroundRepeat:   'no-repeat',

        position: 'absolute',
        width:    '100%',
        height:   '100vh',
        top:  0,
        left: 0,
        opacity: 0.4,
      }}
    />
  );
}

export default BackgroundImage;
