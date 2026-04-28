/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

export async function login(credentials: { email: string; password: string }) {
  const res = await api.post('/auth/login', credentials).catch(() => null);
  return res?.data ?? null; 
  // Kết quả trả về nên có dạng: { token: string, user: { ..., roles: [{ role: { code: 'TEACHER' } }] } }
}

// Thêm hàm kiểm tra quyền Giáo viên
export const isTeacher = (user: any) => {
  if (!user || !user.roles) return false;
  // Kiểm tra mã role_code có phải là TEACHER hay không dựa trên RBAC Schema [cite: 6, 538]
  return user.roles.some((r: any) => r.role.code === 'TEACHER');
};

export async function logout() {
  await api.post('/auth/logout').catch(() => null);
  localStorage.removeItem('token'); // Đảm bảo xóa token khi đăng xuất
}

export async function getProfile() {
  try {
    const res = await api.get('/auth/me');
    return res?.data ?? null;
  } catch (error: any) {
    console.error('Get profile error:', error);
    return error.response?.data || { success: false, message: "Server không phản hồi" };
  }
}

export default { login, logout, getProfile, isTeacher };