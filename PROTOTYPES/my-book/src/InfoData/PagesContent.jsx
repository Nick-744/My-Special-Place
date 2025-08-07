import { Box } from '@mui/material'

// Template for pages in your storybook
export const pages = [
  {
    front: (
      <img
        src   = './textures/book-cover.jpg'
        alt   = 'Εξώφυλλο Βιβλίου'
        style = {{ width: '100%', maxHeight: 1150, borderRadius: '8px', marginTop: '12px' }}
      />
    ),
    back: (
      <Box p = {3} sx = {{ background: '#222', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>Σχετικα με αυτο το βιβλιο:</h3>

        <p style = {{ color: '#fff' }}>
          Αυτό το βιβλίο είναι μια συλλογή από κείμενα και εικόνες.
        </p>

        <p style = {{ color: '#fff', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
          Καλή ανάγνωση!
        </p>
      </Box>
    )
  },
  {
    // --- PAGE 1 (Front) --- Only text
    front: (
      <Box p = {3}>
        <h2>Καλως ηρθατε στον κοσμο μου...</h2>

        <p>
          Αυτό είναι ένα απλό demo! Η πρώτη σελίδα περιέχει μόνο κείμενο.
        </p>

        <p>
          Γυρίστε σελίδα για να δείτε ένα παράδειγμα με εικόνα!
        </p>

        <p>
          Κάντε μια αναζήτηση στη Google! (https://www.google.com/)
        </p>
      </Box>
    ),
    // --- PAGE 1 (Back) --- Black page
    back: (
      <Box p = {3}>
        <h2>Μια εικονα - 1000 λεξεις!</h2>

        <p>
          Εδώ είναι ένα παράδειγμα:
        </p>

        <img
          src   = './images/cat_image.jpg'
          alt   = 'Μία μικρή γατούλα'
          style = {{ width: '90%', maxHeight: 900, borderRadius: '8px', marginTop: '12px' }}
        />

        <p style = {{ marginTop: '8px' }}>
          Αυτή η γάτα είναι έτοιμη για μία περιπέτεια!
        </p>
      </Box>
    )
  },
  {
    // --- PAGE 2 (Front) --- With image
    front: (
      <Box p = {3} sx = {{ background: '#111', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>Μεταβατικη Σελιδα</h3>

        <p style = {{ color: '#fff' }}>
          Αυτή η σελίδα είναι σκόπιμα κενή...
        </p>
      </Box>
    ),
    // --- PAGE 2 (Back) --- Back cover
    back: (
      <Box p = {3} sx = {{ background: '#222', color: '#fff', height: '100%' }}>
        <h3 style = {{ color: '#fff' }}>Το Τελος</h3>

        <p style = {{ color: '#fff', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
          Ευχαριστώ που διαβάσατε αυτό το βιβλίο!
        </p>
      </Box>
    )
  }
]
