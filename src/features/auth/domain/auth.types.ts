export type UserRole = "ADMIN" | "PESERTA";

export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
  lastLoginAt: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FirebaseLoginPayload {
  idToken: string;
}

export type BackendUserRole = "admin" | "peserta";

export interface BackendAuthUser {
  id: number;
  fb_uid: string | null;
  fb_provider: string | null;
  name: string;
  role: BackendUserRole;
  username: string;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export interface BackendAuthResponse {
  message: string;
  data: {
    user: BackendAuthUser;
    token: string;
  };
}

export type BackendMeResponse =
  | BackendAuthUser
  | {
      message?: string;
      data: BackendAuthUser | { user: BackendAuthUser };
    };
