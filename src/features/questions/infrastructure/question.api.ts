import { apiClient } from "@/shared/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/shared/types/common.types";
import type { CreateQuestionPayload, UpdateQuestionPayload } from "../domain/IQuestionRepository.interface";
import type {
  DifficultyLevel,
  ImportQuestionsResult,
  ImportPreviewRow,
  Question,
  QuestionCategory,
  QuestionFilters,
  QuestionOption,
  QuestionOptionLabel,
  QuestionSubcategory,
  QuestionType
} from "../domain/question.types";

type BackendListResponse<T> = {
  data?: T[] | { data?: T[]; total?: number; recordsTotal?: number; recordsFiltered?: number };
  recordsTotal?: number;
  recordsFiltered?: number;
  total?: number;
  meta?: { total?: number; page?: number; limit?: number };
};

type BackendQuestionOption = {
  id?: string | number;
  content?: string;
  text?: string;
  poin?: number;
  score?: number;
};

type BackendCategory = {
  id?: string | number;
  nama?: string;
  name?: string;
  subkategori?: BackendSubcategory[];
  subcategories?: BackendSubcategory[];
};

type BackendSubcategory = {
  id?: string | number;
  id_kategori?: string | number | null;
  kategori_id?: string | number | null;
  nama?: string;
  name?: string;
  jumlah_soal?: number;
  total_soal?: number;
  question_count?: number;
};

type BackendQuestion = {
  id?: string | number;
  content?: string;
  pembahasan?: string | null;
  trik_cepat?: string | null;
  id_kategori?: string | number | null;
  id_subkat?: string | number | null;
  id_subkategori?: string | number | null;
  kategori?: { id?: string | number; nama?: string; name?: string } | string | null;
  subkategori?: { id?: string | number; nama?: string; name?: string } | string | null;
  options?: BackendQuestionOption[];
  opsi?: BackendQuestionOption[];
  difficulty?: DifficultyLevel;
  type?: QuestionType;
  created_at?: string;
  updated_at?: string;
};

type BackendQuestionPayload = {
  content: string;
  pembahasan: string;
  trik_cepat: string | null;
  id_subkat: number | string;
  options: Array<{
    content: string;
    poin: number;
  }>;
};

function unwrapData<T>(value: ApiResponse<T> | T): T {
  return value && typeof value === "object" && "data" in value ? (value as ApiResponse<T>).data : (value as T);
}

function getListData<T>(payload: BackendListResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

function getTotal<T>(payload: BackendListResponse<T> | T[], dataLength: number) {
  if (Array.isArray(payload)) return dataLength;
  if (typeof payload.meta?.total === "number") return payload.meta.total;
  if (typeof payload.total === "number") return payload.total;
  if (typeof payload.recordsFiltered === "number") return payload.recordsFiltered;
  if (typeof payload.recordsTotal === "number") return payload.recordsTotal;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    if (typeof payload.data.total === "number") return payload.data.total;
    if (typeof payload.data.recordsFiltered === "number") return payload.data.recordsFiltered;
    if (typeof payload.data.recordsTotal === "number") return payload.data.recordsTotal;
  }
  return dataLength;
}

function resolveCategoryId(value: string | undefined) {
  return value || undefined;
}

function resolveSubcategoryId(value: string | null | undefined) {
  return value ?? "";
}

function getCategoryName(question: BackendQuestion) {
  if (typeof question.kategori === "string") return question.kategori;
  return question.kategori?.nama ?? question.kategori?.name ?? question.id_kategori?.toString() ?? "Kategori";
}

function getSubcategoryId(question: BackendQuestion) {
  if (question.id_subkat !== undefined && question.id_subkat !== null) return String(question.id_subkat);
  if (question.id_subkategori !== undefined && question.id_subkategori !== null) return String(question.id_subkategori);
  if (typeof question.subkategori === "object" && question.subkategori?.id !== undefined) return String(question.subkategori.id);
  return null;
}

function mapBackendOption(option: BackendQuestionOption, index: number): QuestionOption {
  const label = String.fromCharCode(65 + index) as QuestionOptionLabel;
  const scoreValue = option.poin ?? option.score ?? 0;

  return {
    id: String(option.id ?? label.toLowerCase()),
    label,
    text: option.content ?? option.text ?? "",
    imageUrl: null,
    isCorrect: scoreValue > 0,
    scoreValue
  };
}

function mapBackendQuestion(question: BackendQuestion): Question {
  const options = (question.options ?? question.opsi ?? []).map(mapBackendOption);
  const categoryId = question.id_kategori ?? (typeof question.kategori === "object" ? question.kategori?.id : undefined);
  const now = new Date().toISOString();

  return {
    id: String(question.id ?? ""),
    categoryId: categoryId !== undefined && categoryId !== null ? String(categoryId) : "",
    categoryName: getCategoryName(question),
    subcategoryId: getSubcategoryId(question),
    createdBy: "backend",
    type: question.type ?? "PG",
    text: question.content ?? "",
    imageUrl: null,
    difficulty: question.difficulty ?? "SEDANG",
    tags: [],
    explanation: question.pembahasan ?? "",
    explanationImageUrl: null,
    quickTips: question.trik_cepat ?? null,
    options,
    createdAt: question.created_at ?? now,
    updatedAt: question.updated_at ?? now
  };
}

function toBackendPayload(payload: CreateQuestionPayload | UpdateQuestionPayload): BackendQuestionPayload {
  const idSubkat = resolveSubcategoryId(payload.subcategoryId);

  return {
    content: payload.text ?? "",
    pembahasan: payload.explanation ?? "",
    trik_cepat: payload.quickTips ?? null,
    id_subkat: Number.isNaN(Number(idSubkat)) ? idSubkat : Number(idSubkat),
    options: (payload.options ?? []).map((option) => ({
      content: option.text,
      poin: option.scoreValue
    }))
  };
}

export async function getQuestionsApi(filters?: QuestionFilters): Promise<PaginatedResponse<Question>> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;
  const response = await apiClient.get<BackendListResponse<BackendQuestion> | BackendQuestion[]>("/adm/soal", {
    params: {
      start: (page - 1) * limit,
      length: limit,
      search: filters?.search ?? "",
      id_kategori: resolveCategoryId(filters?.categoryId),
      id_subkategori: resolveSubcategoryId(filters?.subcategoryId),
      include_opsi: true
    }
  });
  const data = getListData(response.data)
    .map(mapBackendQuestion)
    .filter((question) => {
      if (filters?.difficulty && question.difficulty !== filters.difficulty) return false;
      return true;
    });

  return {
    data,
    meta: {
      page,
      limit,
      total: filters?.difficulty ? data.length : getTotal(response.data, data.length)
    }
  };
}

export async function getQuestionByIdApi(id: string) {
  const response = await apiClient.get<ApiResponse<BackendQuestion> | BackendQuestion>(`/adm/soal/${id}`);
  return mapBackendQuestion(unwrapData(response.data));
}

export async function createQuestionApi(payload: CreateQuestionPayload) {
  const response = await apiClient.post<ApiResponse<BackendQuestion> | BackendQuestion>("/adm/soal", toBackendPayload(payload));
  return mapBackendQuestion(unwrapData(response.data));
}

export async function updateQuestionApi(id: string, payload: UpdateQuestionPayload) {
  const response = await apiClient.put<ApiResponse<BackendQuestion> | BackendQuestion>(`/adm/soal/${id}`, toBackendPayload(payload));
  return mapBackendQuestion(unwrapData(response.data));
}

export async function deleteQuestionApi(id: string) {
  await apiClient.delete(`/adm/soal/${id}`);
}

export async function uploadQuestionsExcelApi(file: File, subcategoryId?: string) {
  const formData = new FormData();
  formData.append("id_subkategori", resolveSubcategoryId(subcategoryId));
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<ImportQuestionsResult>>(
    "/adm/soal/import",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
}

export async function confirmQuestionsImportApi(_jobId?: string): Promise<ApiResponse<{ imported: number }>> {
  throw new Error("Endpoint konfirmasi import tidak tersedia di collection API. Gunakan response /adm/soal/import sebagai hasil import.");
}

export async function getQuestionCategoriesApi() {
  const response = await apiClient.get<BackendListResponse<BackendCategory> | BackendCategory[]>(
    "/adm/kategori",
    { params: { start: 0, length: 100, search: "" } }
  );

  return getListData(response.data).map<QuestionCategory>((category) => ({
    id: String(category.id ?? ""),
    name: category.nama ?? category.name ?? "Kategori"
  }));
}

export async function getQuestionSubcategoriesApi(categoryId?: string) {
  const response = await apiClient.get<BackendListResponse<BackendSubcategory> | BackendSubcategory[]>(
    "/adm/subkategori",
    { params: { start: 0, length: 100, search: "" } }
  );

  return getListData(response.data)
    .map<QuestionSubcategory>((subcategory) => ({
      id: String(subcategory.id ?? ""),
      categoryId:
        subcategory.id_kategori !== undefined && subcategory.id_kategori !== null
          ? String(subcategory.id_kategori)
          : subcategory.kategori_id !== undefined && subcategory.kategori_id !== null
            ? String(subcategory.kategori_id)
            : null,
      name: subcategory.nama ?? subcategory.name ?? "Subkategori",
      questionCount: subcategory.jumlah_soal ?? subcategory.total_soal ?? subcategory.question_count
    }))
    .filter((subcategory) => !categoryId || !subcategory.categoryId || subcategory.categoryId === categoryId);
}
