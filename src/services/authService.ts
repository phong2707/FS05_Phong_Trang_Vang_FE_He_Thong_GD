/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/api/apiClient';

export async function login(credentials: { email: string; password: string }) {
  // placeholder - replace with real endpoint
  const res = await api.post('/auth/login', credentials).catch(() => null);
  return res?.data ?? null;
}

export async function logout() {
  await api.post('/auth/logout').catch(() => null);
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
