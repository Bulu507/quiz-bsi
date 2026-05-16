import type { IAuthRepository } from "../domain/IAuthRepository.interface";
import type { AuthResponse, BackendAuthResponse, BackendAuthUser, BackendMeResponse, BackendUserRole, User, UserRole } from "../domain/auth.types";
import { getMeApi, loginApi, loginFirebaseApi } from "./auth.api";

function mapBackendRole(role: BackendUserRole): UserRole {
  if (role === "admin") return "ADMIN";
  if (role === "peserta") return "PESERTA";
  throw new Error(`Role auth tidak dikenal: ${role satisfies never}`);
}

function normalizeUser(rawUser: BackendAuthUser): User {
  return {
    id: String(rawUser.id),
    username: rawUser.username,
    email: null,
    fullName: rawUser.name,
    avatarUrl: null,
    role: mapBackendRole(rawUser.role),
    lastLoginAt: rawUser.last_login_at
  };
}

function normalizeAuthResponse(payload: BackendAuthResponse): AuthResponse {
  if (!payload.data?.token) {
    throw new Error("Response auth tidak menyertakan data.token.");
  }

  if (!payload.data.user) {
    throw new Error("Response auth tidak menyertakan data.user.");
  }

  return { token: payload.data.token, user: normalizeUser(payload.data.user) };
}

function normalizeMeResponse(payload: BackendMeResponse): User {
  const rawUser =
    "data" in payload
      ? "user" in payload.data
        ? payload.data.user
        : payload.data
      : payload;

  if (!rawUser) {
    throw new Error("Response /me tidak menyertakan data user.");
  }

  return normalizeUser(rawUser);
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
  async register() {
    throw new Error("Endpoint register belum tersedia di collection API.");
  },
  async logout() {
    return undefined;
  },
  async getMe() {
    return normalizeMeResponse(await getMeApi());
  }
};
