import type { AuthResponse, FirebaseLoginPayload, LoginCredentials, RegisterPayload, User } from "./auth.types";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  loginWithFirebase(payload: FirebaseLoginPayload): Promise<AuthResponse>;
  register(payload: RegisterPayload): Promise<AuthResponse>;
  logout(): Promise<void>;
  getMe(): Promise<User>;
}
