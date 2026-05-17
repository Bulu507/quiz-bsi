import { apiClient } from "@/shared/lib/api-client";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { ManagedUser, ManagedUserRole, UserFilters } from "../domain/user.types";

type BackendUser = {
  id?: string | number;
  name?: string;
  nama?: string;
  username?: string;
  role?: ManagedUserRole;
  verified?: boolean | number;
  is_verified?: boolean | number;
  verified_at?: string | null;
  created_at?: string | null;
  last_login_at?: string | null;
};

type BackendListResponse<T> = {
  data?: T[] | { data?: T[]; total?: number; recordsTotal?: number; recordsFiltered?: number };
  recordsTotal?: number;
  recordsFiltered?: number;
  total?: number;
};

type BackendUserResponse =
  | BackendUser
  | {
      data?: BackendUser | { user?: BackendUser };
      user?: BackendUser;
    };

function listData<T>(payload: BackendListResponse<T> | T[]) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

function totalData<T>(payload: BackendListResponse<T> | T[], length: number) {
  if (Array.isArray(payload)) return length;
  if (typeof payload.recordsFiltered === "number") return payload.recordsFiltered;
  if (typeof payload.recordsTotal === "number") return payload.recordsTotal;
  if (typeof payload.total === "number") return payload.total;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    if (typeof payload.data.recordsFiltered === "number") return payload.data.recordsFiltered;
    if (typeof payload.data.recordsTotal === "number") return payload.data.recordsTotal;
    if (typeof payload.data.total === "number") return payload.data.total;
  }
  return length;
}

function mapUser(user: BackendUser): ManagedUser {
  const verifiedValue = user.is_verified ?? user.verified ?? user.verified_at;

  return {
    id: String(user.id ?? ""),
    name: user.name ?? user.nama ?? user.username ?? "-",
    username: user.username ?? "-",
    role: user.role === "admin" ? "admin" : "peserta",
    isVerified: Boolean(verifiedValue),
    createdAt: user.created_at ?? null,
    lastLoginAt: user.last_login_at ?? null
  };
}

function unwrapUser(payload: BackendUserResponse): BackendUser {
  if ("data" in payload && payload.data) {
    if ("user" in payload.data && payload.data.user) return payload.data.user;
    return payload.data as BackendUser;
  }

  if ("user" in payload && payload.user) return payload.user;
  return payload as BackendUser;
}

export async function getUsersApi(filters: UserFilters = {}): Promise<PaginatedResponse<ManagedUser>> {
  const start = filters.start ?? 0;
  const length = filters.length ?? 20;
  const response = await apiClient.get<BackendListResponse<BackendUser> | BackendUser[]>("/adm/user", {
    params: {
      start,
      length,
      search: filters.search ?? "",
      show_mode: filters.showMode ?? "",
      role: filters.role ?? ""
    }
  });
  const data = listData(response.data).map(mapUser);

  return {
    data,
    meta: {
      page: Math.floor(start / length) + 1,
      limit: length,
      total: totalData(response.data, data.length)
    }
  };
}

export async function getUserByIdApi(id: string) {
  const response = await apiClient.get<BackendUserResponse>(`/adm/user/${id}`);
  return mapUser(unwrapUser(response.data));
}

export async function verifyUserApi(id: string) {
  await apiClient.post(`/adm/user/${id}/verify`);
}

export async function deleteUserApi(id: string) {
  await apiClient.delete(`/adm/user/${id}`);
}
