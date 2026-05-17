import type { IPackageRepository } from "../../domain/IPackageRepository.interface";

export function startStudentQuizUseCase(repository: IPackageRepository, packageId: string) {
  return repository.startStudentQuiz(packageId);
}
