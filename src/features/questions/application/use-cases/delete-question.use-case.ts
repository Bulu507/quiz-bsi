import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function deleteQuestionUseCase(repository: IQuestionRepository, id: string) {
  return repository.delete(id);
}
