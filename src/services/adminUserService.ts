/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

export interface UserQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterStatus?: string;
  page?: number;
  perPage?: number;
}

export const adminUserService = {
  // 1. Lấy danh sách người dùng
  getUsers: async (params: UserQueryParams) => {
    const res = await api.get('/admin/users', { params });
    return res.data ;  // Trả về { users, total, page, roles, ... }
  },

  // 2. Lấy chi tiết để edit (Bao gồm roles và features hệ thống)
  getUserDetails: async (id: string) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data; // Trả về { targetUser, roles, features }
  },

  // 3. Tạo mới người dùng
  createUser: async (data: any) => {
    const res = await api.post('/admin/users', data);
    return res.data;
  },

  // 4. Cập nhật người dùng (Theo section)
  updateUser: async (id: string, data: any) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },

  // 5. Xóa mềm người dùng
  deleteUser: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  }
};