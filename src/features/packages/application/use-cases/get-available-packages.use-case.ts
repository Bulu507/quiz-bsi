import type { IPackageRepository } from "../../domain/IPackageRepository.interface";

export function getAvailablePackagesUseCase(repository: IPackageRepository) {
  return repository.getAvailableForStudent();
}
