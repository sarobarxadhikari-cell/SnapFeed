import { create } from 'zustand';

const useUIStore = create((set) => ({
  theme: localStorage.getItem('sf_theme') || 'dark',
  sidebarOpen: true,
  modalOpen: null,
  notifications: [],

  setTheme: (theme) => {
    localStorage.setItem('sf_theme', theme);
    document.documentElement.className = theme;
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sf_theme', next);
      document.documentElement.className = next;
      return { theme: next };
    }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  openModal: (modal) => set({ modalOpen: modal }),
  closeModal: () => set({ modalOpen: null }),

  addNotification: (notification) => {
    const id = Date.now().toString(36);
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useUIStore;
