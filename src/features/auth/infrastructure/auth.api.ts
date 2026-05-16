import { apiClient } from "@/shared/lib/api-client";
import type { BackendAuthResponse, BackendMeResponse, LoginCredentials } from "../domain/auth.types";

export async function loginApi(credentials: LoginCredentials) {
  const response = await apiClient.post<BackendAuthResponse>("/login", credentials);
  return response.data;
}

export async function loginFirebaseApi(idToken: string) {
  const response = await apiClient.post<BackendAuthResponse>(
    "/login/fb",
    undefined,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );
  return response.data;
}

export async function getMeApi() {
  const response = await apiClient.get<BackendMeResponse>("/me");
  return response.data;
}
