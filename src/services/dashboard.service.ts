import apiClient from '@/api/apiClient';

export async function getDashboardSummary() {
  const resp = await apiClient.get('/admin/dashboard/summary');
  return resp.data;
}

export default { getDashboardSummary };
