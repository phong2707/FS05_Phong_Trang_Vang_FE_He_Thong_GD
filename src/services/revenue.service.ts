import api from '@/api/apiClient';

export const revenueService = {
  getDashboard: async () => {
    const res = await api.get('/admin/revenue/dashboard');
    return res.data;
  },

  getTransactions: async (params?: { status?: string; limit?: number }) => {
    const res = await api.get('/admin/revenue/transactions', { params });
    return res.data;
  },

  getRevenueByDateRange: async (startDate: string, endDate: string) => {
    const res = await api.get('/admin/revenue/by-date-range', {
      params: { startDate, endDate }
    });
    return res.data;
  }
};