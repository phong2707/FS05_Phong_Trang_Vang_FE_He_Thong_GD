/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

export async function login(credentials: { email: string; password: string }) {
  // ✅ DÙNG ENDPOINT CHO SPA (JWT)
  const res = await api.post('/v1/auth/login', credentials).catch(() => null);
  return res?.data ?? null;
  // Response mong đợi:
  // {
  //   success: true,
  //   token: string,
  //   user: {
  //     roles: [{ code: 'TEACHER', ... }]
  //   }
  // }
}

// ✅ Kiểm tra quyền giáo viên – PHÙ HỢP 100% BE
export const isTeacher = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  return user.roles.some((r: any) => r.code === 'TEACHER');
};

export async function logout() {
  await api.post('/auth/logout').catch(() => null);
  localStorage.removeItem('token');
}

export async function getProfile() {
  try {
    const res = await api.get('/auth/me');
    return res?.data ?? null;
  } catch (error: any) {
    console.error('Get profile error:', error);
    return error.response?.data || { success: false, message: 'Server không phản hồi' };
  }
}

export default { login, logout, getProfile, isTeacher };
