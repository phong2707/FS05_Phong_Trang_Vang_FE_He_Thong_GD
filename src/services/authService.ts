/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';
export async function login(credentials: { email: string; password: string }) {
  // ✅ DÙNG ENDPOINT CHO SPA (JWT)
  const res = await api.post('/api/v1/auth/login', credentials).catch(() => null);
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

<<<<<<< HEAD
// 🆕 Hàm đăng nhập bằng Google ID Token
export async function googleVerify(idToken: string) {
  const res = await api.post('/v1/auth/google/verify', { idToken }).catch(() => null);
  return res?.data ?? null;
  // Kết quả trả về: { accessToken: string, refreshToken: string, user: { ..., roles: string[] } }
}

// Thêm hàm kiểm tra quyền Giáo viên
export const isTeacher = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  
  // Sửa r.role.code thành r.code
  return user.roles.some((r: any) => r.code === 'TEACHER' || r === 'TEACHER'); 
};
export const isStudent = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  return user.roles.some((r: any) => 
    r.code === 'STUDENT' || 
    r === 'STUDENT' || 
    (r.role && r.role.code === 'STUDENT')
  ); 
};
export const isAdmin = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  return user.roles.some((r: any) => 
    r.code === 'ADMIN' || 
    r === 'ADMIN' || 
    (r.role && r.role.code === 'ADMIN')
  ); 
=======
// ✅ Kiểm tra quyền giáo viên – PHÙ HỢP 100% BE
export const isTeacher = (user: any) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  return user.roles.some((r: any) => r.code === 'TEACHER');
>>>>>>> 5533719 (feat(teacher): implement course overview and class group CRUD UI)
};

export async function logout(redirectPath: string = '/auth') {
  await api.post('/auth/logout').catch(() => null);
  localStorage.removeItem('token');
<<<<<<< HEAD
  window.location.href = redirectPath; // Điều hướng về trang login tương ứng
}

export async function forgotPassword(email: string) {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

export async function verifyOtp(email: string, otp: string) {
  const res = await api.post('/auth/verify-otp', { email, otp });
  return res.data; // { success: true, resetToken: '...' }
}

export async function resetPassword(passwordData: any, resetToken: string) {
  const res = await api.post('/auth/reset-password', passwordData, {
    headers: { Authorization: `Bearer ${resetToken}` }
  });
  return res.data;
=======
>>>>>>> 5533719 (feat(teacher): implement course overview and class group CRUD UI)
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

<<<<<<< HEAD
// Sửa trong @/services/authService.ts[cite: 17]
export async function updateProfile(profileData: any) {
  try {
    // Sử dụng instance 'api' thay vì 'axios' để đi đúng đường dẫn backend
    const response = await api.put('/auth/me', profileData); 
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Không thể cập nhật thông tin',
    };
  }
}

// Sửa lại hàm changePassword trong authService_4.ts
export async function changePassword(data: { 
  oldPassword?: string; 
  password: string; 
  passwordConfirmation: string 
}) {
  try {
    // data này sẽ bao gồm oldPassword nếu đổi từ profile 
    // hoặc chỉ password/passwordConfirmation nếu reset từ OTP
    const res = await api.put('/auth/change-password', data);
    return res.data;
  } catch (error: any) {
    return error.response?.data || { success: false, message: "Lỗi kết nối" };
  }
}



export default { login, googleVerify, logout, getProfile, isTeacher, isStudent, isAdmin, updateProfile, forgotPassword, verifyOtp, resetPassword, changePassword };
=======
export default { login, logout, getProfile, isTeacher };
>>>>>>> 5533719 (feat(teacher): implement course overview and class group CRUD UI)
