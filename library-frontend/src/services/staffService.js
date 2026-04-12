import api from './api';

export const staffService = {
    // Get all staff (admin only)
    getAllStaff() {
        return api.get('/management/staff');
    },

    // Create new staff (admin only)
    createStaff(staffData) {
        return api.post('/management/staff/admin', staffData);
    },

    // Update staff (admin only)
    updateStaff(id, staffData) {
        return api.put(`/management/staff/${id}`, staffData);
    },

    // Delete staff (admin only)
    deleteStaff(id) {
        return api.delete(`/management/staff/${id}`);
    }
};
