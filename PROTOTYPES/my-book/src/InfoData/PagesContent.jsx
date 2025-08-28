import { getAllData, getImageUrl } from '../services/cavafyService'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'

// Cover page
const coverPage = {
    front: (
        <Box>
            <h1>~ ΧΡΟΝΟΛΟΓΙΟ ΚΑΒΑΦΗ ~</h1>

            <p>
                Ένα διαδραστικό χρονολόγιο της ζωής του Κ.Π. Καβάφη (1863 – 1933),
                του κορυφαίου νεοελληνικού ποιητή με ριζικές επιρροές στην ευρωπαϊκή μοντέρνα ποίηση.
            </p>

            <p>
                Το υλικό αναδεικνύει βασικά στοιχεία του έργου του Καβάφη και συνοδεύεται
                από πηγές και εικόνες που διευκολύνουν την περαιτέρω μελέτη.
            </p>

            <p>Καλή ανάγνωση!</p>
        </Box>
    )
}

// --- Build front from one item (text) --- //
function buildFront(item) {
    const attrs            = item.attributes
    const description      = attrs.description?.gr || attrs.description?.en || ''
    const imageDescription = attrs.imageDescription?.gr || attrs.imageDescription?.en || ''

    return (
        <Box>
            <h1>~ {attrs.year} ~</h1>

            {imageDescription && (
                <div>
                    <h1>── ΠΕΡΙΓΡΑΦΗ ΕΙΚΟΝΑΣ ──</h1>

                    <p>{imageDescription}</p>
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
    const sourceText       = attrs.source?.gr

    return (
        <Box>
            {imageUrl ? (
                <img
                src         = {imageUrl}
                alt         = {imageDescription}
                // Pass source to canvas pipeline
                data-source = {sourceText || undefined}
                />
            ) : (
                <Box>
                    <h1>Δεν υπάρχει εικόνα</h1>
                </Box>
            )}

            {attrs.source.gr ? (
                <h2>Πηγή: {attrs.source.gr}</h2>
            ) : null}
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
