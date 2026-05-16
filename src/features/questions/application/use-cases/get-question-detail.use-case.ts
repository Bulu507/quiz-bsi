import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function getQuestionDetailUseCase(repository: IQuestionRepository, id: string) {
  return repository.getById(id);
}
