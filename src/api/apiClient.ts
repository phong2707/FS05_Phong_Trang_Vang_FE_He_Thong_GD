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
    // Ưu tiên token riêng, fallback sang token trong user object (legacy)
    let token = localStorage.getItem('token')?.trim();

    if (!token) {
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const parsedUser = JSON.parse(rawUser);
          const maybeToken = parsedUser?.token || parsedUser?.accessToken;
          if (typeof maybeToken === 'string' && maybeToken.trim()) {
            token = maybeToken.trim();
          }
        }
      } catch {
        // ignore JSON parse errors
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug tạm cho các API đang lỗi auth
    if (
      typeof config.url === 'string' &&
      (
        config.url.includes('/assignments/') && config.url.includes('/grade') ||
        config.url.includes('/v1/questions') ||
        config.url.includes('/questions')
      )
    ) {
      console.log('[API DEBUG] URL:', config.url);
      console.log('[API DEBUG] Has token:', !!token);
      console.log('[API DEBUG] Authorization header set:', !!config.headers?.Authorization);
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