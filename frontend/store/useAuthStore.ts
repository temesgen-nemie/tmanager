import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  hasHydrated: boolean; // ← Add this
  login: (user: User, token: string) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void; // ← Add this
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      hasHydrated: false, // ← Add this

      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false, hasHydrated: true }),
      setHasHydrated: (state) => set({ hasHydrated: state }), // ← Add this
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // ← This runs when data is loaded from localStorage
      },
    }
  )
);

export default useAuthStore;