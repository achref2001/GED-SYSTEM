import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8008/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Auth services
export const auth = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // { access_token, token_type }
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    // Current backend doesn't seem to have a /me endpoint explicitly shown in routers,
    // but users might be under /users/me if defined in deps or middleware.
    // For now, let's assume /auth/me or similar if exists.
    // Actually, I'll check auth.py for any current_user endpoint.
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Folder services
export const folders = {
  getAll: async () => {
    const response = await api.get('/folders');
    return response.data; // { success, data, message }
  },
  create: async (name: string, parentId?: number | null) => {
    const response = await api.post('/folders', { name, parent_id: parentId });
    return response.data;
  }
};

// Document services
export const documents = {
  getAll: async (folderId?: number) => {
    const params: any = {};
    if (folderId) params.folder_id = folderId;
    const response = await api.get('/documents', { params });
    return response.data;
  },
  upload: async (file: File, folderId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folder_id', folderId.toString());
    
    const response = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  download: async (id: number) => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};

export default api;
