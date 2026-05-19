import axios from 'axios';

// Đảm bảo URL này khớp với cổng Backend của bạn (thường là 8000)
const API_BASE_URL = 'http://localhost:8000/api/courses';

export const courseApi = {
  // 1. Lấy tất cả khóa học (có hỗ trợ truyền filter)
  getAllCourses: async (params?: { title?: string; level?: string; price?: string; category?: string }) => {
    try {
      const response = await axios.get(API_BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách khóa học:", error);
      throw error;
    }
  },

  // 2. Lấy khóa học sắp khai giảng
  getUpcomingCourses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/upcoming`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy khóa học sắp khai giảng:", error);
      throw error;
    }
  },

  // 3. Lấy chi tiết khóa học theo ID
  getCourseDetail: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy chi tiết khóa học:", error);
      throw error;
    }
  }
};