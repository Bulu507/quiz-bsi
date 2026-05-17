import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function getQuestionSubcategoriesUseCase(repository: IQuestionRepository, categoryId?: string) {
  return repository.getSubcategories(categoryId);
}
