import api from './api';

export const dashboardService = {
    getSummary: async () => {
        const response = await api.get('/dashboard/summary');
        return response.data;
    },

    getMonthlyTrends: async () => {
        const response = await api.get('/dashboard/monthly-trends');
        return response.data;
    },

    getRecentTransactions: async (params = {}) => {
        const response = await api.get('/dashboard/recent-transactions', { params });
        return response.data;
    },

    getLowStock: async (params = {}) => {
        const response = await api.get('/dashboard/low-stock', { params });
        return response.data;
    }
};
