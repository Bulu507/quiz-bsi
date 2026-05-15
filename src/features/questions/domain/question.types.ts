export type QuestionType = "PG" | "PGK" | "BERGAMBAR";
export type DifficultyLevel = "MUDAH" | "SEDANG" | "SULIT";
export type QuestionStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionOptionLabel = "A" | "B" | "C" | "D" | "E";

export interface QuestionCategory {
  id: string;
  name: string;
}

export interface QuestionOption {
  id: string;
  label: QuestionOptionLabel;
  text: string;
  imageUrl: string | null;
  isCorrect: boolean;
  scoreValue: number;
}

export interface Question {
  id: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string | null;
  createdBy: string;
  type: QuestionType;
  text: string;
  imageUrl: string | null;
  difficulty: DifficultyLevel;
  tags: string[];
  explanation: string;
  explanationImageUrl: string | null;
  options: QuestionOption[];
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilters {
  search?: string;
  categoryId?: string;
  difficulty?: DifficultyLevel;
  status?: QuestionStatus;
  page?: number;
  limit?: number;
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: Partial<Question>;
  errors: string[];
  isValid: boolean;
}
