import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";
import type { QuestionFilters } from "../../domain/question.types";

export function getQuestionsUseCase(repository: IQuestionRepository, filters?: QuestionFilters) {
  return repository.getAll(filters);
}
