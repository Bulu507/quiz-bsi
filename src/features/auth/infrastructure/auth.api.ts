import { apiClient } from "@/shared/lib/api-client";
import type { LoginCredentials } from "../domain/auth.types";

export interface BackendAuthPayload {
  token?: string;
  accessToken?: string;
  data?: BackendAuthPayload;
  user?: {
    id?: string | number;
    username?: string;
    email?: string | null;
    fullName?: string;
    name?: string;
    avatarUrl?: string | null;
    role?: string;
  };
  id?: string | number;
  username?: string;
  email?: string | null;
  fullName?: string;
  name?: string;
  avatarUrl?: string | null;
  role?: string;
}

export async function loginApi(credentials: LoginCredentials) {
  const response = await apiClient.post<BackendAuthPayload>("/login", credentials);
  return response.data;
}

export async function loginFirebaseApi(idToken: string) {
  const response = await apiClient.post<BackendAuthPayload>(
    "/login/fb",
    undefined,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return response.data;
}
