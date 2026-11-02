import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('nexus_token'),
  loading: false,
  initialized: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, token, loading: false, error: null });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      set({ loading: false, error: message });
      return false;
    }
  },

  register: async (name, email, password, role = 'STUDENT') => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { user, token } = res.data.data;
      localStorage.setItem('nexus_token', token);
      localStorage.setItem('nexus_user', JSON.stringify(user));
      set({ user, token, loading: false, error: null });
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Try again.';
      set({ loading: false, error: message });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      set({ user: null, token: null });
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data.user, initialized: true });
    } catch {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      set({ user: null, token: null, initialized: true });
    }
  }
}));
