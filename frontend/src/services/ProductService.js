import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const productService = {
    getAllProducts: async () => {
        try {
            console.log('Calling API:', `${BASE_URL}/san-pham`); // Debug log
            const response = await axios.get(`${BASE_URL}/san-pham`);
            console.log('API Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response || error); // Debug log
            throw new Error(error.response?.data?.message || 'Không thể tải danh sách sản phẩm');
        }
    },

    getProductsByCategory: async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL}/products/category/${categoryId}`);
            return response.data;
        } catch (error) {
            throw new Error('Không thể tải sản phẩm theo danh mục');
        }
    }
};