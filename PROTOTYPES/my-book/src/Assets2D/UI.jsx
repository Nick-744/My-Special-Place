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

export const pages = [
  {
    front: (
      <Box p={3}>
        <h2>Welcome to My Special Place</h2>
        <p>This is the cover page. Click the buttons above to flip through the book!</p>
        <a href="https://github.com/">Visit our GitHub</a>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h3>About This Book</h3>
        <p>This is a demo of a 3D book with interactive pages.</p>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Chapter 1: Introduction</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Key Concepts</h4>
        <ul>
          <li>Understanding the basics</li>
          <li>Building foundations</li>
          <li>Practical applications</li>
        </ul>
        <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Chapter 2: Development</h3>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
        <blockquote style={{borderLeft: '4px solid #ccc', paddingLeft: '16px', margin: '16px 0', fontStyle: 'italic'}}>
          "The only way to do great work is to love what you do." - Steve Jobs
        </blockquote>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Exercise 2.1</h4>
        <p><strong>Problem:</strong> Calculate the sum of all even numbers from 1 to 100.</p>
        <p><strong>Solution:</strong></p>
        <code style={{backgroundColor: '#f5f5f5', padding: '8px', display: 'block', marginTop: '8px'}}>
          let sum = 0;<br/>
          for(let i = 2; i &lt;= 100; i += 2) &#123;<br/>
          &nbsp;&nbsp;sum += i;<br/>
          &#125;
        </code>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Chapter 3: Advanced Topics</h3>
        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.</p>
        <h4>Important Notes:</h4>
        <p style={{backgroundColor: '#fff3cd', padding: '12px', border: '1px solid #ffeaa7', borderRadius: '4px'}}>
          ⚠️ Remember to always test your code before deployment.
        </p>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Summary</h4>
        <p>In this chapter we covered:</p>
        <ol>
          <li>Advanced programming concepts</li>
          <li>Best practices and patterns</li>
          <li>Real-world applications</li>
        </ol>
        <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.</p>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Chapter 4: Practical Examples</h3>
        <p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates.</p>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '16px'}}>
          <tr style={{borderBottom: '1px solid #ddd'}}>
            <th style={{padding: '8px', textAlign: 'left'}}>Method</th>
            <th style={{padding: '8px', textAlign: 'left'}}>Description</th>
          </tr>
          <tr style={{borderBottom: '1px solid #ddd'}}>
            <td style={{padding: '8px'}}>GET</td>
            <td style={{padding: '8px'}}>Retrieve data</td>
          </tr>
          <tr>
            <td style={{padding: '8px'}}>POST</td>
            <td style={{padding: '8px'}}>Create new data</td>
          </tr>
        </table>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Code Example</h4>
        <pre style={{backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '4px', overflow: 'auto', fontSize: '14px'}}>
{`function calculateArea(radius) {
  const pi = 3.14159;
  return pi * radius * radius;
}

const area = calculateArea(5);
console.log('Area:', area);`}
        </pre>
        <p style={{marginTop: '16px'}}>This function demonstrates basic mathematical operations in JavaScript.</p>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Chapter 5: Conclusion</h3>
        <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.</p>
        <h4>What's Next?</h4>
        <p>Continue your learning journey with these recommended resources:</p>
        <ul>
          <li>Advanced JavaScript patterns</li>
          <li>Framework documentation</li>
          <li>Open source contributions</li>
        </ul>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Final Thoughts</h4>
        <p>Congratulations on completing this book! You've learned the fundamentals and are ready to tackle more complex challenges.</p>
        <p style={{textAlign: 'center', marginTop: '32px', fontStyle: 'italic'}}>
          "The best time to plant a tree was 20 years ago. The second best time is now."
        </p>
        <p style={{textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#666'}}>
          Thank you for reading!
        </p>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Appendix A: Resources</h3>
        <h4>Useful Links:</h4>
        <ul>
          <li><a href="https://developer.mozilla.org">MDN Web Docs</a></li>
          <li><a href="https://stackoverflow.com">Stack Overflow</a></li>
          <li><a href="https://github.com">GitHub</a></li>
        </ul>
        <h4>Recommended Reading:</h4>
        <ul>
          <li>JavaScript: The Good Parts</li>
          <li>Clean Code</li>
          <li>Design Patterns</li>
        </ul>
      </Box>
    ),
    back: (
      <Box p={3}>
        <h4>Glossary</h4>
        <dl>
          <dt style={{fontWeight: 'bold', marginTop: '8px'}}>API</dt>
          <dd>Application Programming Interface</dd>
          <dt style={{fontWeight: 'bold', marginTop: '8px'}}>DOM</dt>
          <dd>Document Object Model</dd>
          <dt style={{fontWeight: 'bold', marginTop: '8px'}}>JSON</dt>
          <dd>JavaScript Object Notation</dd>
          <dt style={{fontWeight: 'bold', marginTop: '8px'}}>HTTP</dt>
          <dd>HyperText Transfer Protocol</dd>
        </dl>
      </Box>
    )
  },
  {
    front: (
      <Box p={3}>
        <h3>Index</h3>
        <div style={{columnCount: 2, columnGap: '20px'}}>
          <p><strong>A</strong></p>
          <p>API, 45</p>
          <p>Arrays, 12, 15</p>
          <p><strong>B</strong></p>
          <p>Boolean, 8</p>
          <p><strong>C</strong></p>
          <p>Classes, 23</p>
          <p>Callbacks, 18</p>
          <p><strong>D</strong></p>
          <p>DOM, 30</p>
          <p><strong>F</strong></p>
          <p>Functions, 10, 14</p>
          <p><strong>J</strong></p>
          <p>JSON, 35</p>
          <p><strong>O</strong></p>
          <p>Objects, 16, 20</p>
        </div>
      </Box>
    ),
    back: 'book-back'
  }
]

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
