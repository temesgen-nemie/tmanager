import { create } from "zustand";
import api from "@/lib/axios";
import useAuthStore from "./useAuthStore";

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loading: false,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/users/me"); // your backend endpoint
      set({ profile: res.data.user });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      const res = await api.put("/users/update-profile", data);
      set({ profile: res.data.user });
      // Update Zustand Auth Store if needed
      useAuthStore.getState().login(res.data.user, useAuthStore.getState().token!);
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProfileStore;
