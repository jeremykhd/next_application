import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        setUser: (user) => set({ user }),
        setAuthenticated: (status) => set({ isAuthenticated: status }),
        logout: () => set({ isAuthenticated: false, user: null }),
      }),
      {
        name: "app-storage",
      }
    )
  )
);
