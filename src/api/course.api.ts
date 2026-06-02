import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/courses';
// Nếu bạn không muốn tạo route mới, hãy đổi link gọi API cho khớp với route hiện tại:
const CATEGORY_API_URL = 'http://localhost:8000/api/categories';

export const courseApi = {
  getAllCourses: async (params?: { title?: string; level?: string; price?: string; category?: string }) => {
    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
  },

  getUpcomingCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/upcoming`);
    return response.data;
  },

  getCourseDetail: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  getCategories: async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      return [];
    }
  }
};