import type { IUserRepository } from "../../domain/IUserRepository.interface";

export function deleteUserUseCase(repository: IUserRepository, id: string) {
  return repository.delete(id);
}
