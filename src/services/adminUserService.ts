/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

// Export các Interface ở đây để các file khác không bị báo đỏ
export interface Permission {
  id: string;
  name: string;
  code: string;
}

export interface Feature {
  id: string;
  name: string;
  code: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface UserQueryParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export const adminUserService = {
  getUsers: async (params: UserQueryParams) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },
  getUsersStats: async () => {
    const res = await api.get('/admin/users/stats');
    return res.data;
  },
  getUserDetails: async (id: string) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await api.post('/admin/users', data);
    return res.data;
  },
  updateUser: async (id: string, data: any) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },
  getRoles: async () => {
    const res = await api.get('/admin/roles');
    return res.data;
  },
  getFeatures: async () => {
    const res = await api.get('/admin/features');
    return res.data;
  },
  createRole: async (data: any) => {
    const res = await api.post('/admin/roles', data);
    return res.data;
  },
  getRoleDetails: async (id: string) => {
    const res = await api.get(`/admin/roles/${id}`);
    return res.data;
  },
  updateRole: async (id: string, data: any) => {
    const res = await api.put(`/admin/roles/${id}`, data);
    return res.data;
  },
  deleteRole: async (id: string) => {
    const res = await api.delete(`/admin/roles/${id}`);
    return res.data;
  }
};