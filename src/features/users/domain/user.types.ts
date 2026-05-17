export type ManagedUserRole = "admin" | "peserta";
export type UserShowMode = "verified" | "unverified" | "";
export type UserRoleFilter = ManagedUserRole | "all" | "";

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  role: ManagedUserRole;
  isVerified: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
}

export interface UserFilters {
  start?: number;
  length?: number;
  search?: string;
  showMode?: UserShowMode;
  role?: UserRoleFilter;
}
