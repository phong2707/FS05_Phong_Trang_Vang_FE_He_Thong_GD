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
  const res = await api.get('/auth/me').catch(() => null);
  return res?.data ?? null;
}

export default { login, logout, getProfile };
