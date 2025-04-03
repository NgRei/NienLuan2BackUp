import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const productService = {
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/product`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },

    getFeaturedProducts: async () => {
        try {
            console.log('Fetching featured products...');
            const response = await axios.get(`${BASE_URL}/product/noi-bat`);
            console.log('Featured products response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    },

    getProductsByCategory: async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}/product/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category products:', error);
            return [];
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            return null;
        }
    },

    searchProducts: async (searchTerm) => {
        try {
            const response = await axios.get(`${BASE_URL}/product/tim-kiem`, {
                params: { q: searchTerm }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }
};