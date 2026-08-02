import api from './api';

export const transactionService = {
    createTransaction: async (data) => {
        const response = await api.post('/transactions', data);
        return response.data;
    },

    getInvoice: async (id) => {
        const response = await api.get(`/transactions/${id}/invoice`);
        return response.data;
    },

    getTransactions: async (params = {}) => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },

    getTransaction: async (id) => {
        const response = await api.get(`/transactions/${id}`);
        return response.data;
    }
};
