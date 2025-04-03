import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const categoryService = {
    getAllCategories: async () => {
        try {
            console.log('Calling API:', `${BASE_URL}/categories`); // Debug log
            const response = await axios.get(`${BASE_URL}/categories`);
            console.log('API Response:', response.data); // Debug log
            if (!Array.isArray(response.data)) {
                console.error('Invalid response format:', response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error);
            return []; // Return empty array instead of throwing
        }
    }
}; 