import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  authReady: boolean; // đã chạy xong silent refresh lúc khởi động chưa
  setAccessToken: (accessToken: string | null) => void;
  clearTokens: () => void;
  setAuthReady: (authReady: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  authReady: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  clearTokens: () => set({ accessToken: null }),
  setAuthReady: (authReady) => set({ authReady }),
}));
