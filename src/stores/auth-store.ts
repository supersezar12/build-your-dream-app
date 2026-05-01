import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../lib/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const mockUser: User = {
  id: "user-1",
  email: "karwan@smartgreen.iq",
  name: "Karwan Hassan",
  role: "admin",
  is_vip: true,
  location: "Erbil, Iraq",
  created_at: "2026-01-01",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, _password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        // Accept any credentials — demo mode
        set({ user: { ...mockUser, email }, isLoading: false });
      },

      register: async (_email, _password, name) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        set({ user: { ...mockUser, name, email: _email }, isLoading: false });
      },

      logout: () => set({ user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "sg-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
