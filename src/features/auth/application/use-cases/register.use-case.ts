import type { IAuthRepository } from "../../domain/IAuthRepository.interface";
import type { RegisterPayload } from "../../domain/auth.types";

export function registerUseCase(repository: IAuthRepository, payload: RegisterPayload) {
  return repository.register(payload);
}
