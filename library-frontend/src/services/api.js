import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  // baseURL: '/api',
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// xử lí lỗi 401 Unauthorized - nếu token hết hạn hoặc không hợp lệ thì xóa token và redirect về trang login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect khi có token (nghĩa là đang đăng nhập rồi nhưng token hết hạn)
      const token = localStorage.getItem('token');
      if (token) {

        localStorage.clear();
        window.location.href = '/login';
      }
      // Nếu chưa có token (đang login lần đầu) thì không redirect
    }
    return Promise.reject(error);
  }
);

export default api;
