import api from './api';

export const bookService = {
    // Get all books
    getAllBooks() {
        return api.get('/library/books');
    },

    // Get book by maSach
    getBookByMaSach(maSach) {
        return api.get(`/library/books/masach/${maSach}`);
    },

    // Get out of stock books
    getOutOfStockBooks() {
        return api.get("/library/books/out-of-stock");
    },

    // Create new book (admin only)
    createBook(bookData) {
        return api.post("/library/books", bookData);
    },

    // Update book (admin only)
    updateBook(id, bookData) {
        return api.put(`/library/books/${id}`, bookData);
    },

    // Delete book (admin only)
    deleteBook(id) {
        return api.delete(`/library/books/${id}`);
    }
};
