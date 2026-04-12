import api from './api';

export const borrowService = {
  // Create new borrow request
  createBorrow(borrowData) {
    return api.post("/library/borrows", borrowData);
  },

  // Get all borrows (admin only)
  getAllBorrows() {
    return api.get("/library/borrows");
  },

  // Get borrow history by user
  getBorrowHistoryByUser(userId) {
    return api.get(`/library/borrows/me/${userId}`);
  },

  // Mark borrow as returned (admin only)
  markAsReturned(id) {
    return api.patch(`/library/borrows/return/${id}`);
  },

  // Delete borrow record (admin only)
  deleteBorrow(id) {
    return api.delete(`/library/borrows/${id}`);
  },

  approveBorrow(id) {
    return api.patch(`/library/borrows/approve/${id}`);
  },
  rejectBorrow(id) {
    return api.patch(`/library/borrows/reject/${id}`);
  },
};
