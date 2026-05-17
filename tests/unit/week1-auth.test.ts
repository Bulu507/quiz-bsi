import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { getAuthRedirectPath, persistAuthSession, clearAuthSession } from "@/features/auth/application/auth-session";
import { loginUseCase } from "@/features/auth/application/use-cases/login.use-case";
import type { AuthResponse, User } from "@/features/auth/domain/auth.types";
import type { IAuthRepository } from "@/features/auth/domain/IAuthRepository.interface";

const adminUser: User = {
  id: "1",
  username: "admin",
  email: null,
  fullName: "Admin Quiz BSI",
  avatarUrl: null,
  role: "ADMIN",
  lastLoginAt: null
};

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    })
  };
}

function installBrowserSession() {
  const localStorage = createStorage();
  let cookie = "";

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage }
  });

  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      get cookie() {
        return cookie;
      },
      set cookie(value: string) {
        cookie = cookie ? `${cookie}; ${value}` : value;
      }
    }
  });

  return { localStorage, getCookie: () => cookie };
}

function makeRequest(pathname: string, cookies: Record<string, string> = {}) {
  return {
    url: `http://localhost:3000${pathname}`,
    nextUrl: { pathname },
    cookies: {
      get(name: string) {
        const value = cookies[name];
        return value ? { name, value } : undefined;
      }
    }
  } as unknown as NextRequest;
}

function getRedirectPath(response: Response) {
  return new URL(response.headers.get("location") ?? "").pathname;
}

describe("Week 1 Auth Unit", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegates username/password login to auth repository", async () => {
    const session: AuthResponse = { token: "admin-token", user: adminUser };
    const repository = {
      login: vi.fn().mockResolvedValue(session)
    } as unknown as IAuthRepository;

    await expect(loginUseCase(repository, { username: "admin", password: "admin" })).resolves.toEqual(session);
    expect(repository.login).toHaveBeenCalledWith({ username: "admin", password: "admin" });
  });

  it("validates username/password before calling repository", async () => {
    const repository = {
      login: vi.fn()
    } as unknown as IAuthRepository;

    await expect(loginUseCase(repository, { username: " ", password: "admin" })).rejects.toThrow("Username wajib diisi.");
    await expect(loginUseCase(repository, { username: "admin", password: "" })).rejects.toThrow("Password wajib diisi.");
    expect(repository.login).not.toHaveBeenCalled();
  });

  it("resolves redirect path from authenticated role", () => {
    expect(getAuthRedirectPath("ADMIN")).toBe("/dashboard");
    expect(getAuthRedirectPath("PESERTA")).toBe("/student/dashboard");
  });

  it("persists and clears token, role, user, and auth cookies", () => {
    const browser = installBrowserSession();

    persistAuthSession({ token: "admin-token", user: adminUser });

    expect(browser.localStorage.setItem).toHaveBeenCalledWith("quiz-bsi-token", "admin-token");
    expect(browser.localStorage.setItem).toHaveBeenCalledWith("quiz-bsi-role", "ADMIN");
    expect(browser.localStorage.setItem).toHaveBeenCalledWith("quiz-bsi-user", JSON.stringify(adminUser));
    expect(browser.getCookie()).toContain("quiz-bsi-token=admin-token");
    expect(browser.getCookie()).toContain("quiz-bsi-role=ADMIN");

    clearAuthSession();

    expect(browser.localStorage.removeItem).toHaveBeenCalledWith("quiz-bsi-token");
    expect(browser.localStorage.removeItem).toHaveBeenCalledWith("quiz-bsi-role");
    expect(browser.localStorage.removeItem).toHaveBeenCalledWith("quiz-bsi-user");
    expect(browser.getCookie()).toContain("quiz-bsi-token=; path=/; max-age=0");
    expect(browser.getCookie()).toContain("quiz-bsi-role=; path=/; max-age=0");
  });

  it("redirects anonymous users from protected routes to login", () => {
    const response = middleware(makeRequest("/dashboard"));

    expect(response.status).toBe(307);
    expect(getRedirectPath(response)).toBe("/login");
  });

  it("redirects authenticated admin away from public auth pages", () => {
    const response = middleware(makeRequest("/login", { "quiz-bsi-token": "admin-token", "quiz-bsi-role": "ADMIN" }));

    expect(response.status).toBe(307);
    expect(getRedirectPath(response)).toBe("/dashboard");
  });

  it("allows admin routes for admin and blocks peserta", () => {
    const adminResponse = middleware(makeRequest("/questions", { "quiz-bsi-token": "admin-token", "quiz-bsi-role": "ADMIN" }));
    const usersResponse = middleware(makeRequest("/users", { "quiz-bsi-token": "admin-token", "quiz-bsi-role": "ADMIN" }));
    const pesertaResponse = middleware(makeRequest("/questions", { "quiz-bsi-token": "peserta-token", "quiz-bsi-role": "PESERTA" }));
    const pesertaUsersResponse = middleware(makeRequest("/users", { "quiz-bsi-token": "peserta-token", "quiz-bsi-role": "PESERTA" }));

    expect(adminResponse.status).toBe(200);
    expect(usersResponse.status).toBe(200);
    expect(pesertaResponse.status).toBe(307);
    expect(getRedirectPath(pesertaResponse)).toBe("/student/dashboard");
    expect(pesertaUsersResponse.status).toBe(307);
    expect(getRedirectPath(pesertaUsersResponse)).toBe("/student/dashboard");
  });

  it("allows peserta routes for peserta and blocks admin", () => {
    const pesertaResponse = middleware(makeRequest("/student/dashboard", { "quiz-bsi-token": "peserta-token", "quiz-bsi-role": "PESERTA" }));
    const adminResponse = middleware(makeRequest("/student/dashboard", { "quiz-bsi-token": "admin-token", "quiz-bsi-role": "ADMIN" }));

    expect(pesertaResponse.status).toBe(200);
    expect(adminResponse.status).toBe(307);
    expect(getRedirectPath(adminResponse)).toBe("/dashboard");
  });

  it("treats invalid role cookie as unauthenticated", () => {
    const response = middleware(makeRequest("/dashboard", { "quiz-bsi-token": "token", "quiz-bsi-role": "SUPERADMIN" }));

    expect(response.status).toBe(307);
    expect(getRedirectPath(response)).toBe("/login");
  });
});
