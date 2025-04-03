import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor để xử lý lỗi
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            // Log chi tiết lỗi từ server
            console.error('Server Error:', error.response.data);
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    logout: async () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
    },

    getCurrentUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('userToken');
    },

    updateProfile: async (userData) => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                throw new Error('Vui lòng đăng nhập lại');
            }

            // Log token để debug
            console.log('Sending token:', token);

            const response = await axios.put(
                `${BASE_URL}/auth/profile`,
                userData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Log response để debug
            console.log('Update profile response:', response.data);

            return response.data;
        } catch (error) {
            console.error('Update profile error:', error);
            if (error.response?.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('userToken');
                localStorage.removeItem('userData');
                window.location.href = '/login';
            }
            throw error;
        }
    },

    updateStoredUserData: (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }
};