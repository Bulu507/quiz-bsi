import type { ApiResponse, PaginatedResponse } from "@/shared/types/common.types";
import type { ImportPreviewRow, Question, QuestionCategory, QuestionFilters } from "./question.types";

export type CreateQuestionPayload = Omit<Question, "id" | "createdAt" | "updatedAt">;
export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;

export interface IQuestionRepository {
  getAll(filters?: QuestionFilters): Promise<PaginatedResponse<Question>>;
  getById(id: string): Promise<Question>;
  create(payload: CreateQuestionPayload): Promise<Question>;
  update(id: string, payload: UpdateQuestionPayload): Promise<Question>;
  delete(id: string): Promise<void>;
  uploadExcel(file: File): Promise<ApiResponse<{ jobId: string; preview: ImportPreviewRow[] }>>;
  confirmImport(jobId: string): Promise<ApiResponse<{ imported: number }>>;
  getCategories(): Promise<QuestionCategory[]>;
}
