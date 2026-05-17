import type { IAuthRepository } from "../../domain/IAuthRepository.interface";
import type { LoginCredentials } from "../../domain/auth.types";

export async function loginUseCase(repository: IAuthRepository, credentials: LoginCredentials) {
  if (!credentials.username.trim()) throw new Error("Username wajib diisi.");
  if (!credentials.password) throw new Error("Password wajib diisi.");
  return repository.login(credentials);
}
