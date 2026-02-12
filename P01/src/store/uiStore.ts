import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (message: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
  toastMessage: null,
  setToastMessage: (message) => set({ toastMessage: message }),
}));
