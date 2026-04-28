import api from '@/api/apiClient';

export async function login(credentials: { email: string; password: string }) {
<<<<<<< Updated upstream
  // placeholder - replace with real endpoint
  const res = await api.post('/auth/login', credentials).catch(() => null);
  return res?.data ?? null;
}

export async function logout() {
  await api.post('/auth/logout').catch(() => null);
=======
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (error: any) {
    // Trả về error response từ server nếu có
    return error.response?.data || { success: false, message: "Server không phản hồi" };
  }
}

// Kiểm tra quyền Giáo viên
export const isTeacher = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  // Kiểm tra xem user có role TEACHER không
  return user.roles.some((role: any) => role.code === 'TEACHER');
};

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Xóa token khi đăng xuất dù có lỗi hay không
    localStorage.removeItem('token');
  }
>>>>>>> Stashed changes
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

export default { login, logout, getProfile };
