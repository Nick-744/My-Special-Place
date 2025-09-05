import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL

// Query to get all data from backend
const GET_ALL_DATA =
	'/cavafy-timelines?' +
	'publicationState=live' +
	'&populate[1]=imageDescription,description,source,image,year,slideType,category' +
	'&sort=year:asc'

export async function getAllData() {
	try {
		const query    = API_BASE + GET_ALL_DATA
		const response = await axios.get(query)

		console.info('Fetched data:', response.data.data)

		return response.data.data;
	}
	catch (error) {
		console.error('Failed to fetch data:', error)

		throw error;
	}
}

// Helper - Get image URL
export function getImageUrl(imageData, size = 'small') {
	if (!imageData?.data?.attributes) return null;

	const baseUrl = import.meta.env.VITE_SERVER
	const attrs   = imageData.data.attributes

	// Use specific size or fallback to original
	const imageUrl = attrs.formats?.[size]?.url || attrs.url

	return baseUrl + imageUrl;
}
