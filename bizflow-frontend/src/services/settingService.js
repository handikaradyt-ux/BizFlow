import api from './api';

/**
 * Fetch the singleton application settings record.
 * The backend guarantees one record always exists.
 */
export const getSettings = async () => {
    const response = await api.get('/settings');
    return response.data; // { success, message, data }
};

/**
 * Persist updated settings via PUT /api/settings.
 * @param {Object} payload - The full settings object to save
 */
export const updateSettings = async (payload) => {
    const response = await api.put('/settings', payload);
    return response.data; // { success, message, data }
};
