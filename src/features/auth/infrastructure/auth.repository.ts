import type { IAuthRepository } from "../domain/IAuthRepository.interface";
import type { AuthResponse, User, UserRole } from "../domain/auth.types";
import { loginApi, loginFirebaseApi, type BackendAuthPayload } from "./auth.api";

function normalizeRole(role: string | undefined, fallback: UserRole): UserRole {
  const normalized = role?.toUpperCase();
  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "PESERTA") return "PESERTA";
  if (normalized === "INSTRUCTOR") return "ADMIN";
  if (normalized === "STUDENT") return "PESERTA";
  return fallback;
}

function unwrapPayload(payload: BackendAuthPayload): BackendAuthPayload {
  return payload.data ? unwrapPayload(payload.data) : payload;
}

function normalizeAuthResponse(payload: BackendAuthPayload, fallbackRole: UserRole): AuthResponse {
  const body = unwrapPayload(payload);
  const rawUser = body.user ?? body;
  const username = rawUser.username ?? rawUser.email ?? "peserta";
  const token = body.token ?? body.accessToken ?? "";

  const user: User = {
    id: String(rawUser.id ?? username),
    username,
    email: rawUser.email ?? null,
    fullName: rawUser.fullName ?? rawUser.name ?? username,
    avatarUrl: rawUser.avatarUrl ?? null,
    role: normalizeRole(rawUser.role ?? body.role, fallbackRole)
  };

  return { token, user };
}

export const authRepository: IAuthRepository = {
  async login(credentials) {
    const payload = await loginApi(credentials);
    const fallbackRole = credentials.username.toLowerCase() === "admin" ? "ADMIN" : "PESERTA";
    return normalizeAuthResponse(payload, fallbackRole);
  },
  async loginWithFirebase(payload) {
    const response = await loginFirebaseApi(payload.idToken);
    const session = normalizeAuthResponse(response, "PESERTA");
    return { ...session, user: { ...session.user, role: "PESERTA" } };
  },
  async register(payload) {
    return {
      token: "mock-token",
      user: {
        id: "user-2",
        username: payload.email,
        email: payload.email,
        fullName: payload.fullName,
        avatarUrl: null,
        role: payload.role === "ADMIN" ? "ADMIN" : "PESERTA"
      }
    };
  },
  async logout() {
    return undefined;
  },
  async getMe() {
    return {
      id: "user-1",
      username: "admin",
      email: null,
      fullName: "Pengajar Quiz-BSI",
      avatarUrl: null,
      role: "ADMIN"
    };
  }
};
