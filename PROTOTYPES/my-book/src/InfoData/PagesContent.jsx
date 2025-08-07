import { Box } from '@mui/material'

// Template for pages in your storybook
export const pages = [
  {
    front: (
      <img
        src   = './textures/book-cover.jpg'
        alt   = 'Book Cover'
        style = {{ width: '100%', maxHeight: 1150, borderRadius: '8px', marginTop: '12px' }}
      />
    ),
    back: (
      <Box p = {3} sx = {{ background: '#222', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>About This Book</h3>

        <p style = {{ color: '#fff' }}>
          This book is a collection of text and images.
        </p>

        <p style = {{ color: '#fff', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
          Enjoy your reading journey!
        </p>
      </Box>
    )
  },
  {
    // --- PAGE 1 (Front) --- Only text
    front: (
      <Box p = {3}>
        <h2>Welcome to My Special Place</h2>

        <p>
          This is a simple demo! The first page contains only text.
        </p>

        <p>
          Turn the page to see an example with an image!
        </p>

        <p>
          Google it! (https://www.google.com/)
        </p>
      </Box>
    ),
    // --- PAGE 1 (Back) --- Black page
    back: (
      <Box p = {3} sx = {{ background: '#111', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>Interlude</h3>

        <p style = {{ color: '#fff' }}>
          This page is left black intentionally...
        </p>
      </Box>
    )
  },
  {
    // --- PAGE 2 (Front) --- With image
    front: (
      <Box p = {3}>
        <h2>The Magic of Images</h2>

        <p>
          Here is an example:
        </p>

        <img
          src   = './images/cat_image.jpg'
          alt   = 'Little cat'
          style = {{ width: '90%', maxHeight: 900, borderRadius: '8px', marginTop: '12px' }}
        />

        <p style = {{ marginTop: '8px' }}>
          This cat is ready for adventure!
        </p>
      </Box>
    ),
    // --- PAGE 2 (Back) --- Back cover
    back: (
      <Box p = {3} sx = {{ background: '#222', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>The End</h3>

        <p style = {{ color: '#fff', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
          Thank you for reading!
        </p>
      </Box>
    )
  }
]
