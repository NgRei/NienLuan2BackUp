import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

export const cartService = {
    getCart: async () => {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(`${BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addToCart: async (productId, quantity) => {
        const token = localStorage.getItem('userToken');
        const response = await axios.post(
            `${BASE_URL}/cart/add`,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response.data;
    },

    updateQuantity: async (cartId, quantity) => {
        const token = localStorage.getItem('userToken');
        const response = await axios.put(
            `${BASE_URL}/cart/update`,
            { cartId, quantity },
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response.data;
    },

    removeFromCart: async (cartId) => {
        const token = localStorage.getItem('userToken');
        const response = await axios.delete(
            `${BASE_URL}/cart/remove/${cartId}`,
            { headers: { Authorization: `Bearer ${token}` }}
        );
        return response.data;
    }
};
