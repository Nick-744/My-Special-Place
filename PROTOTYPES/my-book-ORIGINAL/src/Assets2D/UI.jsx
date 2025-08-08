import { AppBar, Toolbar, Button, Box } from '@mui/material'
import { atom, useAtom } from 'jotai'

const pictures = [
  'DSC00680',
  'DSC00933',
  'DSC00966',
  'DSC00983',
  'DSC01011',
  'DSC01040',
  'DSC01064',
  'DSC01071',
  'DSC01103',
  'DSC01145',
  'DSC01420',
  'DSC01461',
  'DSC01489',
  'DSC02031',
  'DSC02064',
  'DSC02069',
]

export const pageAtom = atom(0)

export const pages = [{
  front: 'book-cover',
  back:  pictures[0]
}]
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back:  pictures[(i + 1) % pictures.length],
  })
}
pages.push({
  front: pictures[pictures.length - 1],
  back: 'book-back',
})

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom)

  return (
    <AppBar 
    position  = 'fixed' 
    color     = 'transparent' 
    elevation = {0} 
    sx        = {{ top: 0, backdropFilter: 'blur(8px)' }}
    >
      <Toolbar sx = {{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <Box display = 'flex' gap = {1} py = {1}>

          {[...pages].map((_, index) => (
            <Button
            key     = {index}
            variant = {index === page ? 'contained' : 'outlined'}
            color   = {index === page ? 'primary'   : 'inherit'}
            onClick = {() => setPage(index)}
            sx      = {{
              textTransform: 'uppercase',
              borderRadius:  '50px',
              minWidth:      '100px',
              fontWeight:    600,

              backgroundColor: index === page ? 'white' : 'rgba(255,255,255,0.1)',
              color:           index === page ? 'black' : 'white',

              '&:hover': {
                backgroundColor: index === page ? 'white' : 'rgba(255,255,255,0.3)'
              }
            }}
            >
              {index === 0 ? 'Cover' : `Page ${index}`}
            </Button>
          ))}

          <Button
            variant = {page === pages.length ? 'contained' : 'outlined'}
            color   = {page === pages.length ? 'primary'   : 'inherit'}
            onClick = {() => setPage(pages.length)}
            sx      = {{
              textTransform: 'uppercase',
              borderRadius:  '50px',
              minWidth:      '120px',
              fontWeight:    600,

              backgroundColor: page === pages.length ? 'white' : 'rgba(255,255,255,0.1)',
              color:           page === pages.length ? 'black' : 'white',

              '&:hover': {
                backgroundColor: page === pages.length ? 'white' : 'rgba(255,255,255,0.3)'
              }
            }}
          >
            Back Cover
          </Button>

        </Box>
      </Toolbar>
    </AppBar>
  )
}
