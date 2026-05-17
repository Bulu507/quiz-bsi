import type { IUserRepository } from "../../domain/IUserRepository.interface";

export function verifyUserUseCase(repository: IUserRepository, id: string) {
  return repository.verify(id);
}
