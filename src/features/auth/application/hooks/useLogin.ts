"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginUseCase } from "@/features/auth/application/use-cases/login.use-case";
import { loginWithFirebaseUseCase } from "@/features/auth/application/use-cases/login-with-firebase.use-case";
import { authRepository } from "@/features/auth/infrastructure/auth.repository";
import { getGoogleRedirectIdToken, signInWithGoogleProvider } from "@/features/auth/infrastructure/firebase-auth";
import type { AuthResponse, LoginCredentials } from "@/features/auth/domain/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { clearAuthSession, getAuthRedirectPath, persistAuthSession } from "../auth-session";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finishLogin = useCallback(async (session: AuthResponse) => {
    if (!session.token) {
      throw new Error("Response login tidak menyertakan token.");
    }

    persistAuthSession(session);
    setSession(session.user, session.token);
    router.replace(getAuthRedirectPath(session.user.role));
  }, [router, setSession]);

  async function login(credentials: LoginCredentials) {
    setIsLoading(true);
    setError(null);

    try {
      const session = await loginUseCase(authRepository, credentials);
      if (session.user.role !== "ADMIN") {
        throw new Error("Login username/password hanya untuk admin. Peserta masuk dengan Google.");
      }
      await finishLogin(session);
    } catch (cause) {
      setError(getLoginErrorMessage(cause, "Login gagal."));
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithGoogle() {
    setIsLoading(true);
    setError(null);

    try {
      clearAuthSession();
      const idToken = await signInWithGoogleProvider();
      const session = await loginWithFirebaseUseCase(authRepository, idToken);
      await finishLogin({ ...session, user: { ...session.user, role: "PESERTA" } });
    } catch (cause) {
      setError(getLoginErrorMessage(cause, "Login Google gagal."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function completeRedirectLogin() {
      setIsLoading(true);

      try {
        const idToken = await getGoogleRedirectIdToken();
        if (!idToken || !isMounted) return;

        const session = await loginWithFirebaseUseCase(authRepository, idToken);
        await finishLogin({ ...session, user: { ...session.user, role: "PESERTA" } });
      } catch (cause) {
        if (isMounted) {
          setError(getLoginErrorMessage(cause, "Login Google gagal."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // void completeRedirectLogin();

    return () => {
      isMounted = false;
    };
  }, [finishLogin]);

  return { error, isLoading, login, loginWithGoogle };
}

function getLoginErrorMessage(cause: unknown, fallback: string) {
  if (axios.isAxiosError(cause)) {
    const status = cause.response?.status;
    const data = cause.response?.data;
    const message =
      typeof data === "string"
        ? data
        : data?.message ?? data?.error ?? data?.errors?.[0]?.message;

    return [fallback, status ? `HTTP ${status}` : null, message].filter(Boolean).join(" - ");
  }

  return cause instanceof Error ? cause.message : fallback;
}
