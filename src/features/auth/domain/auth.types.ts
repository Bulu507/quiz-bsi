export type UserRole = "ADMIN" | "PESERTA";

export interface User {
  id: string;
  username: string;
  email: string | null;
  fullName: string;
  avatarUrl: string | null;
  role: UserRole;
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
