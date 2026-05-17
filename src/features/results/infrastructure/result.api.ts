import { apiClient } from "@/shared/lib/api-client";
import type { CategoryResult } from "../domain/result.types";

type BackendResultRow = {
  kategori?: string;
  category?: string;
  nama_kategori?: string;
  score?: string | number;
  nilai?: string | number;
  progress?: number;
  persen?: number;
  passed?: boolean;
  lulus?: boolean;
  status?: string;
};

type BackendResultResponse =
  | BackendResultRow[]
  | {
      data?: BackendResultRow[] | { data?: BackendResultRow[]; results?: BackendResultRow[] };
      results?: BackendResultRow[];
    };

function listData(payload: BackendResultResponse): BackendResultRow[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (payload.data && typeof payload.data === "object") {
    if (Array.isArray(payload.data.data)) return payload.data.data;
    if (Array.isArray(payload.data.results)) return payload.data.results;
  }
  return [];
}

function mapResult(row: BackendResultRow): CategoryResult {
  const passed = row.passed ?? row.lulus ?? row.status?.toLowerCase() === "lulus";

  return {
    category: row.kategori ?? row.category ?? row.nama_kategori ?? "Kategori",
    score: String(row.score ?? row.nilai ?? "-"),
    progress: row.progress ?? row.persen ?? 0,
    status: passed ? "Lulus" : "Tidak lulus"
  };
}

export async function getStudentAttemptResultApi(attemptId: string) {
  const response = await apiClient.get<BackendResultResponse>(`/pst/quiz/${attemptId}/result`, {
    params: { no_urut: 1, length: 100 }
  });

  return listData(response.data).map(mapResult);
}
