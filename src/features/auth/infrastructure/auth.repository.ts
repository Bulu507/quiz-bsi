import type { IAuthRepository } from "../domain/IAuthRepository.interface";
import type { AuthResponse, BackendAuthResponse, BackendUserRole, User, UserRole } from "../domain/auth.types";
import { loginApi, loginFirebaseApi } from "./auth.api";

function mapBackendRole(role: BackendUserRole): UserRole {
  if (role === "admin") return "ADMIN";
  if (role === "peserta") return "PESERTA";
  throw new Error(`Role auth tidak dikenal: ${role satisfies never}`);
}

function normalizeAuthResponse(payload: BackendAuthResponse): AuthResponse {
  if (!payload.data?.token) {
    throw new Error("Response auth tidak menyertakan data.token.");
  }

  if (!payload.data.user) {
    throw new Error("Response auth tidak menyertakan data.user.");
  }

  const rawUser = payload.data.user;
  const user: User = {
    id: String(rawUser.id),
    username: rawUser.username,
    email: null,
    fullName: rawUser.name,
    avatarUrl: null,
    role: mapBackendRole(rawUser.role),
    lastLoginAt: rawUser.last_login_at
  };

  return { token: payload.data.token, user };
}

export const authRepository: IAuthRepository = {
  async login(credentials) {
    const payload = await loginApi(credentials);
    return normalizeAuthResponse(payload);
  },
  async loginWithFirebase(payload) {
    const response = await loginFirebaseApi(payload.idToken);
    const session = normalizeAuthResponse(response);
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
        role: payload.role === "ADMIN" ? "ADMIN" : "PESERTA",
        lastLoginAt: null
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
      role: "ADMIN",
      lastLoginAt: null
    };
  }
};
