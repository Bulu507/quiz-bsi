import type { IQuestionRepository } from "../../domain/IQuestionRepository.interface";

export function uploadQuestionsExcelUseCase(repository: IQuestionRepository, file: File) {
  return repository.uploadExcel(file);
}

export function confirmQuestionsImportUseCase(repository: IQuestionRepository, jobId: string) {
  return repository.confirmImport(jobId);
}
