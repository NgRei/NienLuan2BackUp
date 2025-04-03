import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const productService = {
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/san-pham`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    getFeaturedProducts: async () => {
        try {
            console.log('Fetching featured products...');
            const response = await axios.get(`${BASE_URL}/san-pham/noi-bat`);
            console.log('Featured products response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    },

    getProductsByCategory: async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}/san-pham/danh-muc/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category products:', error);
            return [];
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}/danh-muc/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    }
};