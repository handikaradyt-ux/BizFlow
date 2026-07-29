import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    isInitialized: false, // Tracks if we have attempted to fetch the user on startup

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/login', { email, password });
            const { user, token } = response.data.data;
            
            localStorage.setItem('token', token);
            set({ user, token, isAuthenticated: true, isLoading: false, isInitialized: true });
            return { success: true };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    },

    fetchUser: async () => {
        const token = get().token;
        // If there's no token, we are initialized but not authenticated
        if (!token) {
            set({ isInitialized: true });
            return;
        }

        // Only set loading if we don't already have the user to avoid flashing UI
        if (!get().user) {
            set({ isLoading: true });
        }

        try {
            const response = await api.get('/user');
            set({ 
                user: response.data, 
                isAuthenticated: true, 
                isLoading: false,
                isInitialized: true 
            });
        } catch (error) {
            // If the token is invalid or expired, clear everything
            get().logout();
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false,
            isInitialized: true
        });
    },
}));

export default useAuthStore;