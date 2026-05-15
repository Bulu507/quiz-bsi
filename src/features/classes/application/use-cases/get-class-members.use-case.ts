import type { IClassRepository } from "../../domain/IClassRepository.interface";

export function getClassMembersUseCase(repository: IClassRepository, classId: string) {
  return repository.getMembers(classId);
}
