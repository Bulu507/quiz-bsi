import type { IUserRepository } from "../../domain/IUserRepository.interface";
import type { UserFilters } from "../../domain/user.types";

export function getAllUsersUseCase(repository: IUserRepository, filters?: UserFilters) {
  return repository.getAll(filters);
}
