import axios from 'axios';
import { API_BASE } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('sf_refresh_token');
        if (!refreshToken) {
          localStorage.removeItem('sf_token');
          localStorage.removeItem('sf_user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });

        if (res.data.success) {
          localStorage.setItem('sf_token', res.data.token);
          localStorage.setItem('sf_refresh_token', res.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('sf_token');
        localStorage.removeItem('sf_refresh_token');
        localStorage.removeItem('sf_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── AUTH ──────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) =>
    api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  checkEmail: (email) => api.get(`/auth/check-email?email=${email}`),
};

// ─── USERS ─────────────────────────────────────────────
export const usersAPI = {
  search: (q) => api.get(`/users/search?q=${q}`),
  getById: (id) => api.get(`/users/${id}`),
  getOnline: () => api.get('/users/online'),
};

// ─── MESSAGES ──────────────────────────────────────────
export const messagesAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (conversationId, page = 1) =>
    api.get(`/messages/${conversationId}?page=${page}`),
  sendMessage: (data) => api.post('/messages', data),
  markSeen: (conversationId) => api.put(`/messages/${conversationId}/seen`),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
};

// ─── STORIES ───────────────────────────────────────────
export const storiesAPI = {
  getStories: () => api.get('/stories'),
  createStory: (formData) =>
    api.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  viewStory: (storyId) => api.post(`/stories/${storyId}/view`),
  deleteStory: (storyId) => api.delete(`/stories/${storyId}`),
};

// ─── NOTIFICATIONS ─────────────────────────────────────
export const notificationsAPI = {
  getNotifications: (page = 1) => api.get(`/notifications?page=${page}`),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};
