"use client";

import { useRouter } from "next/navigation";
import { authRepository } from "@/features/auth/infrastructure/auth.repository";
import { useAuthStore } from "@/store/auth.store";
import { clearAuthSession } from "../auth-session";

export function useLogout() {
  const router = useRouter();
  const resetSession = useAuthStore((state) => state.resetSession);

  return async function logout() {
    try {
      await authRepository.logout();
    } finally {
      clearAuthSession();
      resetSession();
      router.replace("/login");
    }
  };
}
