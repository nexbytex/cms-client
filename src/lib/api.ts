import axios from 'axios';
import type { CreateUserPayload, UpdateUserPayload, UserRecord } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cms_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;


// User API
export const usersApi = {
  getAll: (role?: string) =>
    api.get<{ users: UserRecord[] }>("/users", { params: role ? { role } : {} }),

  getById: (id: string) =>
    api.get<{ user: UserRecord }>(`/users/${id}`),

  create: (data: CreateUserPayload) =>
    api.post<{ user: UserRecord }>("/users", data),

  update: (id: string, data: UpdateUserPayload) =>
    api.put<{ user: UserRecord }>(`/users/${id}`, data),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};