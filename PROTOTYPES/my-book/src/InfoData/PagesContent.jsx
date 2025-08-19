import { getAllData, getImageUrl } from '../services/cavafyService'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'

// Cover page
const coverPage = {
    front: (
        <Box
        p  = {3}
        sx = {{
            background: '#222',
            color:      '#fff',
            height:     '100%'
        }}
        >
            <h3 style = {{ color: '#fff' }}>Χρονολόγιο Καβάφη</h3>

            <p style = {{ color: '#fff' }}>
                Ένα διαδραστικό χρονολόγιο της ζωής και του έργου του Κ.Π. Καβάφη.
            </p>

            <p
            style = {{
                color:     '#fff',
                textAlign: 'center',
                marginTop: '20px',
                fontStyle: 'italic'
            }}
            >
                Καλή ανάγνωση!
            </p>
        </Box>
    )
}

// --- Build front from one item (text) --- //
function buildFront(item) {
    const attrs            = item.attributes
    const description      = attrs.description?.gr || attrs.description?.en || ''
    const imageDescription = attrs.imageDescription?.gr || attrs.imageDescription?.en || ''

    return (
        <Box
        p  = {3}
        sx = {{
            background: '#fff',
            height:     '100%',
            overflow:   'auto'
        }}
        >
            <h2
            style = {{
                color:         '#333',
                borderBottom:  '2px solid #666',
                paddingBottom: '8px',
                marginBottom:  '20px',
                fontSize:      '18px'
            }}
            >
                {attrs.year} - {attrs.category}
            </h2>

            <div
            style = {{
                fontSize:     '14px',
                lineHeight:   '1.6',
                marginBottom: '20px',
                color:        '#333'
            }}
            dangerouslySetInnerHTML = {{ __html: description }}
            />

            {imageDescription && (
                <div style = {{ marginBottom: '20px' }}>
                    <h4
                    style = {{
                        color:        '#333',
                        marginBottom: '12px',
                        fontSize:     '14px',
                        fontWeight:   'bold'
                    }}
                    >
                        Περιγραφή Εικόνας:
                    </h4>
                    <p
                    style = {{
                        color:      '#555',
                        fontSize:   '13px',
                        lineHeight: '1.5',
                        fontStyle:  'italic',
                        background: '#f9f9f9',
                        padding:    '12px',

                        borderRadius: '4px',
                        border:       '1px solid #e0e0e0'
                    }}
                    >
                        {imageDescription}
                    </p>
                </div>
            )}

            {attrs.source?.gr && (
                <div style = {{ marginTop: 'auto', paddingTop: '20px' }}>
                    <h4
                    style = {{
                        color:        '#333',
                        marginBottom: '8px',
                        fontSize:     '12px',
                        fontWeight:   'bold'
                    }}
                    >
                        Πηγή:
                    </h4>
                    <p
                    style = {{
                        color:      '#777',
                        fontSize:   '11px',
                        lineHeight: '1.4',
                        fontStyle:  'italic'
                    }}
                    >
                        {attrs.source.gr}
                    </p>
                </div>
            )}
        </Box>
    );
}

// --- Build back from one item (image) --- //
function buildBack(item) {
    const attrs            = item.attributes
    const imageUrl         = getImageUrl(attrs.image, 'large')
    const imageDescription = attrs.imageDescription?.gr || attrs.imageDescription?.en || ''

    return (
        <Box
        sx = {{
            width:          '100%',
            height:         '100%',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     '#f8f8f8',
            overflow:       'hidden'
        }}
        >
            {imageUrl ? (
                <img
                src   = {imageUrl}
                alt   = {imageDescription}
                style = {{
                    width:        '100%',
                    height:       '100%',
                    objectFit:    'cover',
                    borderRadius: '0px'
                }}
                />
            ) : (
                <Box
                sx = {{
                    width:          '100%',
                    height:         '100%',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    background:     '#e0e0e0',
                    color:          '#666'
                }}
                >
                    <p>Δεν υπάρχει εικόνα</p>
                </Box>
            )}
        </Box>
    );
}

// create a page where front comes from prevItem and back from currItem
function createPairedPage(prevItem, currItem) {
    return {
        front: buildFront(prevItem),
        back:  buildBack(currItem)
    };
}

// Hook to manage dynamic pages
export function usePages() {
    const [pages,   setPages  ] = useState([coverPage])
    const [loading, setLoading] = useState(true)
    const [error,   setError  ] = useState(null)

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                const data = await getAllData()

                if (data && data.length > 0) {
                const dynamicPages = []

                // First page: keep cover front, set its back to first item's image!
                dynamicPages.push({
                    front: coverPage.front,
                    back:  buildBack(data[0])
                })

                // For each subsequent index create paired pages:
                // front = previous item text - back = current item image
                for (let i = 1; i < data.length; i += 1)
                    dynamicPages.push(createPairedPage(data[i - 1], data[i]))

                setPages(dynamicPages)
                }
            }
            catch (err) {
                console.error('Failed to load timeline data:', err)
                setError(err);
            }
            finally { setLoading(false) }
        }

        loadData()
    }, [])

    return { pages, loading, error };
}

export const pages = [coverPage];
