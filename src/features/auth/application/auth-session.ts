"use client";

import type { AuthResponse, UserRole } from "../domain/auth.types";

export const AUTH_TOKEN_KEY = "quiz-bsi-token";
export const AUTH_ROLE_KEY = "quiz-bsi-role";
export const AUTH_USER_KEY = "quiz-bsi-user";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getAuthRedirectPath(role: UserRole) {
  return role === "ADMIN" ? "/dashboard" : "/student/dashboard";
}

export function persistAuthSession(session: AuthResponse) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  window.localStorage.setItem(AUTH_ROLE_KEY, session.user.role);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));

  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(session.token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;
  document.cookie = `${AUTH_ROLE_KEY}=${session.user.role}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearAuthSession() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_ROLE_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);

  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${AUTH_ROLE_KEY}=; path=/; max-age=0; samesite=lax`;
}
