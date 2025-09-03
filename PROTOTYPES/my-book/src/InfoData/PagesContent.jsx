import { getAllData, getImageUrl } from '../services/cavafyService'
import { useState, useEffect } from 'react'

// --- Cover page --- //
const coverPage = {
    front: (
        <>
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
        </>
    )
}

// --- Build front page (TEXT) --- //
function buildFront(item) {
    const attrs            = item.attributes
    const imageDescription = attrs.imageDescription?.gr || attrs.imageDescription?.en || ''

    return (
        <>
            <h1>~ {attrs.year} ~</h1>

            {imageDescription && (
                <div>
                    <h1>── ΠΕΡΙΓΡΑΦΗ ΕΙΚΟΝΑΣ ──</h1>

                    <p>{imageDescription}</p>
                </div>
            )}
        </>
    );
}

// --- Build back page (IMAGE & CAPTION) --- //
function buildBack(item) {
    const attrs            = item.attributes
    const imageUrl         = getImageUrl(attrs.image, 'large')
    const imageDescription = attrs.imageDescription?.gr || attrs.imageDescription?.en || ''
    const sourceText       = attrs.source?.gr

    return (
        <>
            {imageUrl ? (
                <img
                src         = {imageUrl}
                alt         = {imageDescription}
                data-source = {sourceText || undefined}
                />
            ) : (
                <h1>Δεν υπάρχει εικόνα</h1>
            )}

            {attrs.source.gr ? (
                <h2>Πηγή: {attrs.source.gr}</h2>
            ) : null}
        </>
    );
}

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

                    // First page - Keep cover as front and set the back from data!
                    dynamicPages.push({
                        front: coverPage.front,
                        back:  buildBack(data[0])
                    })

                    // Χρειάζεται να δημιουργηθεί μία σελίδα που μπροστά θα έχει τις
                    // πληροφορίες της εικόνας του data[0] (cover page) και πίσω
                    // τα δεδομένα του data[1] (εικόνα στην προκειμένη περίπτωση).
                    // Αντίστοιχη λογική χρησιμοποιείται και για τα επόμενα ζεύγη σελίδων!
                    for (let i = 1; i < data.length; i += 1)
                        dynamicPages.push(createPairedPage(data[i - 1], data[i]))

                    setPages(dynamicPages)
                }
            }
            catch (err) {
                console.error('Failed to load timeline data:', err)
                setError(err)
            }
            finally { setLoading(false) }
        }

        loadData()
    }, [])

    return { pages, loading, error };
}

export const pages = [coverPage];
