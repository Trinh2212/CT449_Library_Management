import api from './api';

export const authService = {
    // Register new user
    register(userData) {
        return api.post('/auth/register', userData);
    },

    // Login user
    login(credentials) {
        return api.post('/auth/login', credentials);
    },

    // Get current user info
    getCurrentUser(email) {
        return api.get(`/auth/me/${email}`);
    }
};
