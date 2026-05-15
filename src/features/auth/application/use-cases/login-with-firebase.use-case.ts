import type { IAuthRepository } from "../../domain/IAuthRepository.interface";

export function loginWithFirebaseUseCase(repository: IAuthRepository, idToken: string) {
  return repository.loginWithFirebase({ idToken });
}
