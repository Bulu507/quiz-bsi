import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function uploadQuestionsExcelUseCase(repository: IQuestionRepository, file: File, subcategoryId?: string) {
  return repository.uploadExcel(file, subcategoryId);
}

export function confirmQuestionsImportUseCase(repository: IQuestionRepository, jobId: string) {
  return repository.confirmImport(jobId);
}
