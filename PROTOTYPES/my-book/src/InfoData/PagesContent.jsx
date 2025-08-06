import { Box } from '@mui/material'

// Template for pages in your storybook
export const pages = [
  {
    // --- PAGE 1 (Front) --- Only text
    front: (
      <Box p={3}>
        <h2>Welcome to My Special Place</h2>
        <p>
          This is a simple storybook demo. The first page contains only text, showing how you can introduce your story or project.
        </p>
        <p>
          Turn the page to see an example with an image!
        </p>
      </Box>
    ),
    // --- PAGE 1 (Back) --- Black page
    back: (
      <Box p={3} sx={{ background: '#111', color: '#fff', height: '100%' }}>
        <h3 style={{ color: '#fff' }}>Interlude</h3>
        <p style={{ color: '#fff' }}>
          This is a black page, which can be used for dramatic effect or as a separator.
        </p>
      </Box>
    )
  },
  {
    // --- PAGE 2 (Front) --- With image
    front: (
      <Box p={3}>
        <h2>The Magic of Images</h2>
        <p>
          Images make your story more vivid and engaging. Here is an example:
        </p>
        <img
          src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6"
          alt="Little fox in the forest"
          style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }}
        />
        <p style={{ marginTop: '8px' }}>
          This cat is ready for adventure!
        </p>
      </Box>
    ),
    // --- PAGE 2 (Back) --- Back cover
    back: (
      <Box p={3} sx={{ background: '#222', color: '#fff', height: '100%' }}>
        <h3 style={{ color: '#fff' }}>The End</h3>
        <p style={{ color: '#fff', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
          Thank you for reading! This is the back cover.
        </p>
      </Box>
    )
  }
]
