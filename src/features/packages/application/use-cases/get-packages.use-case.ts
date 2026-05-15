import type { IPackageRepository } from "../../domain/IPackageRepository.interface";

export function getPackagesUseCase(repository: IPackageRepository) {
  return repository.getAll();
}
