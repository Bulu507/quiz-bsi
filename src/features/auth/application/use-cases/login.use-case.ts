import type { IAuthRepository } from "../../domain/IAuthRepository.interface";
import type { LoginCredentials } from "../../domain/auth.types";

export function loginUseCase(repository: IAuthRepository, credentials: LoginCredentials) {
  return repository.login(credentials);
}
