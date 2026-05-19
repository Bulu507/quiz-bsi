export type QuestionType = "PG" | "PGK" | "BERGAMBAR";
export type DifficultyLevel = "MUDAH" | "SEDANG" | "SULIT";
export type QuestionOptionLabel = "A" | "B" | "C" | "D" | "E";

export interface QuestionCategory {
  id: string;
  name: string;
}

export interface QuestionSubcategory {
  id: string;
  categoryId: string | null;
  name: string;
  questionCount?: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFilters {
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  difficulty?: DifficultyLevel;
  page?: number;
  limit?: number;
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: Partial<Question>;
  errors: string[];
  isValid: boolean;
}

export interface ImportQuestionsResult {
  jobId?: string;
  preview?: ImportPreviewRow[];
  imported?: number;
  total?: number;
  failed?: number;
  inserted?: number;
}
