import { apiClient } from "@/shared/lib/api-client";
import type { ExamPackage } from "../domain/package.types";

type BackendQuiz = {
  id?: string | number;
  nama_tes?: string;
  nama?: string;
  title?: string;
  deskripsi?: string | null;
  description?: string | null;
  time_mins?: number | null;
  passing_grade?: number | null;
  status?: string | null;
  jlh_soal?: number | null;
  jumlah_soal?: number | null;
  komponen?: Array<{ jlh_soal?: number | null; time_mins?: number | null; passing_grade?: number | null }>;
  created_at?: string;
  updated_at?: string;
};

type BackendListResponse<T> = {
  data?: T[] | { data?: T[] };
};

function listData<T>(payload: BackendListResponse<T> | T[]) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

function mapStatus(status?: string | null): ExamPackage["status"] {
  return status?.toLowerCase() === "draft" ? "DRAFT" : "PUBLISHED";
}

function mapQuiz(quiz: BackendQuiz): ExamPackage {
  const now = new Date().toISOString();
  const componentQuestionCount = quiz.komponen?.reduce((total, item) => total + (item.jlh_soal ?? 0), 0);
  const componentDuration = quiz.komponen?.reduce((total, item) => total + (item.time_mins ?? 0), 0);

  return {
    id: String(quiz.id ?? ""),
    title: quiz.nama_tes ?? quiz.nama ?? quiz.title ?? "Quiz",
    description: quiz.deskripsi ?? quiz.description ?? "",
    createdBy: "backend",
    durationMinutes: quiz.time_mins ?? componentDuration ?? 0,
    isShuffled: true,
    isOptionShuffled: true,
    scoringConfig: { correct: 1, wrong: 0, unanswered: 0 },
    passingConfig: quiz.passing_grade ? { total: quiz.passing_grade } : null,
    maxAttempts: null,
    showResultAfter: "IMMEDIATELY",
    status: mapStatus(quiz.status),
    questionCount: quiz.jlh_soal ?? quiz.jumlah_soal ?? componentQuestionCount ?? 0,
    createdAt: quiz.created_at ?? now,
    updatedAt: quiz.updated_at ?? now
  };
}

export async function getAdminQuizzesApi() {
  const response = await apiClient.get<BackendListResponse<BackendQuiz> | BackendQuiz[]>("/adm/quiz", {
    params: { start: 0, length: 20, search: "" }
  });

  return listData(response.data).map(mapQuiz);
}
