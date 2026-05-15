/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  adminId: string;
  createdAt: string;
  subjectCount?: number;
  subjects?: Subject[];
  startDate?: string;
  endDate?: string;
  durationValue?: number;
  durationUnit?: string;
  daysOfWeek?: string;
  level?: string;
  maxStudents?: number;
  language?: string;
  isFeatured?: boolean;
  discountPrice?: number;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

export const adminCourseService = {
  // Lấy danh sách khóa học
  getCourses: async () => {
    const res = await api.get('/admin/courses');
    return res.data;
  },

  // Tạo khóa học mới
  createCourse: async (data: any) => {
    const res = await api.post('/admin/courses', data);
    return res.data;
  },

  // Lấy chi tiết khóa học
  getCourseDetail: async (id: string) => {
    const res = await api.get(`/admin/courses/${id}`);
    return res.data;
  },

  // Cập nhật khóa học
  updateCourse: async (id: string, data: any) => {
    const res = await api.put(`/admin/courses/${id}`, data);
    return res.data;
  },

  // Lấy danh sách giáo viên
  getTeachers: async () => {
    const res = await api.get('/admin/courses/teachers');
    return res.data;
  }
};
