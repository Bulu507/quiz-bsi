import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function getQuestionCategoriesUseCase(repository: IQuestionRepository) {
  return repository.getCategories();
}
