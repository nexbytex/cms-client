import { create } from 'zustand';
import type { User } from '../types/index';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('cms_token'),
  isAuthenticated: !!localStorage.getItem('cms_token'),

  setAuth: (user, token) => {
    localStorage.setItem('cms_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('cms_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));