import axios from 'axios';

// Đảm bảo baseURL trỏ đúng vào server backend
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Luôn lấy token mới nhất từ localStorage trước mỗi request
    const token = localStorage.getItem('token');

    if (token) {
      // FIX: Đảm bảo format Bearer chuẩn chỉnh
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }

    // Debug tạm cho luồng chấm bài: kiểm tra request có gắn Authorization hay chưa
    if (typeof config.url === 'string' && config.url.includes('/assignments/') && config.url.includes('/grade')) {
      console.log('[API DEBUG][GRADE] URL:', config.url);
      console.log('[API DEBUG][GRADE] Has token in localStorage:', !!token);
      console.log('[API DEBUG][GRADE] Authorization header set:', !!config.headers?.Authorization);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ redirect nếu thực sự bị 401 và không phải đang ở trang login
    if (error.response && error.response.status === 401) {
      const isLoginPage = window.location.pathname.includes('/login');
      const isGuestEnrollmentCall =
        typeof error.config?.url === 'string' &&
        error.config.url.includes('/v1/enrollments') &&
        error.config.method?.toLowerCase() === 'post';

      // Không redirect cho luồng guest enroll
      if (!isLoginPage && !isGuestEnrollmentCall) {
        console.error("Phiên đăng nhập hết hạn!");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Điều hướng về trang login tương ứng
        const redirectPath = window.location.pathname.startsWith('/admin') 
          ? '/login/admin' 
          : '/login/teacher';
        
        window.location.href = redirectPath;
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;