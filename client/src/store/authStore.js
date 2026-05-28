import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('sf_token') || null,
  refreshToken: localStorage.getItem('sf_refresh_token') || null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        localStorage.setItem('sf_token', res.data.token);
        localStorage.setItem('sf_refresh_token', res.data.refreshToken);
        localStorage.setItem('sf_user', JSON.stringify(res.data.user));
        set({
          user: res.data.user,
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.signup({ name, email, password });
      if (res.data.success) {
        localStorage.setItem('sf_token', res.data.token);
        localStorage.setItem('sf_refresh_token', res.data.refreshToken);
        localStorage.setItem('sf_user', JSON.stringify(res.data.user));
        set({
          user: res.data.user,
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    try {
      const rt = get().refreshToken;
      if (rt) {
        await authAPI.logout(rt);
      }
    } catch (err) {
      // proceed with local logout
    }
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_refresh_token');
    localStorage.removeItem('sf_user');
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('sf_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await authAPI.getMe();
      if (res.data.success) {
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_refresh_token');
      localStorage.removeItem('sf_user');
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  updateProfile: async (formData) => {
    try {
      const res = await authAPI.updateProfile(formData);
      if (res.data.success) {
        set({ user: res.data.user });
        localStorage.setItem('sf_user', JSON.stringify(res.data.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
