import api from './api';

export const productService = {
    getProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data;
    },
    
    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    
    createProduct: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },
    
    updateProduct: async (id, formData) => {
        // Laravel requires spoofing PUT method for multipart/form-data
        formData.append('_method', 'PUT');
        const response = await api.post(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },
    
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
