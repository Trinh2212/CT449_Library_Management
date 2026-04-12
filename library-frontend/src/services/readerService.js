import api from './api';

export const readerService = {
    // Get all readers (admin only)
    getAllReaders() {
        return api.get('/management/readers');
    },

    // Get reader by ID (admin only)
    getReaderById(id) {
        return api.get(`/management/readers/${id}`);
    },

    createReader(readerData) {
        return api.post('/management/readers', readerData);
    },

    // Update reader (admin only)
    updateReader(id, readerData) {
        return api.put(`/management/readers/${id}`, readerData);
    },

    // Delete reader (admin only)
    deleteReader(id) {
        return api.delete(`/management/readers/${id}`);
    }
};
