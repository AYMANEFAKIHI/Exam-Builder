import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '../../../shared/src/types';
import api from '../lib/api';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (credentials) => {
    try {
      set({ loading: true });
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      toast.success('Login successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.error || 'Login failed');
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ loading: true });
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.error || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.info('Logged out');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data, token });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));
