"use client";

import { create } from "zustand";
import type { User } from "@/features/auth/domain/auth.types";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  resetSession: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setSession: (user, token) => set({ user, token }),
  setUser: (user) => set({ user }),
  resetSession: () => set({ user: null, token: null })
}));
