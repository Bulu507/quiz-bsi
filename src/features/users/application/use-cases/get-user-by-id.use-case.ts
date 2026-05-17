import type { IUserRepository } from "../../domain/IUserRepository.interface";

export function getUserByIdUseCase(repository: IUserRepository, id: string) {
  return repository.getById(id);
}
