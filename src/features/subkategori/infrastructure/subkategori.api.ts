import { apiClient } from "@/shared/lib/api-client";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { CreateSubkategoriPayload, Subkategori, SubkategoriFilters, UpdateSubkategoriPayload } from "../domain/subkategori.types";

type BackendSubkategori = {
  id?: string | number;
  id_kategori?: string | number | null;
  kategori_id?: string | number | null;
  nama?: string;
  name?: string;
  kategori?: { id?: string | number; nama?: string; name?: string } | string | null;
  jumlah_soal?: number;
  total_soal?: number;
  question_count?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

type BackendListResponse<T> = {
  data?: T[] | { data?: T[]; total?: number; recordsTotal?: number; recordsFiltered?: number };
  recordsTotal?: number;
  recordsFiltered?: number;
  total?: number;
};

type BackendSubkategoriResponse =
  | BackendSubkategori
  | {
      data?: BackendSubkategori | { subkategori?: BackendSubkategori };
      subkategori?: BackendSubkategori;
    };

function listData<T>(payload: BackendListResponse<T> | T[]) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && typeof payload.data === "object" && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
}

function totalData<T>(payload: BackendListResponse<T> | T[], length: number) {
  if (Array.isArray(payload)) return length;
  if (typeof payload.recordsFiltered === "number") return payload.recordsFiltered;
  if (typeof payload.recordsTotal === "number") return payload.recordsTotal;
  if (typeof payload.total === "number") return payload.total;
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    if (typeof payload.data.recordsFiltered === "number") return payload.data.recordsFiltered;
    if (typeof payload.data.recordsTotal === "number") return payload.data.recordsTotal;
    if (typeof payload.data.total === "number") return payload.data.total;
  }
  return length;
}

function getKategoriId(subkategori: BackendSubkategori) {
  const categoryFromObject = typeof subkategori.kategori === "object" ? subkategori.kategori?.id : undefined;
  return subkategori.id_kategori ?? subkategori.kategori_id ?? categoryFromObject ?? "";
}

function getKategoriName(subkategori: BackendSubkategori) {
  if (typeof subkategori.kategori === "string") return subkategori.kategori;
  return subkategori.kategori?.nama ?? subkategori.kategori?.name ?? String(getKategoriId(subkategori) || "-");
}

function mapSubkategori(subkategori: BackendSubkategori): Subkategori {
  return {
    id: String(subkategori.id ?? ""),
    idKategori: String(getKategoriId(subkategori)),
    nama: subkategori.nama ?? subkategori.name ?? "-",
    namaKategori: getKategoriName(subkategori),
    jumlahSoal: subkategori.jumlah_soal ?? subkategori.total_soal ?? subkategori.question_count ?? 0,
    createdAt: subkategori.created_at ?? null,
    updatedAt: subkategori.updated_at ?? null
  };
}

function unwrapSubkategori(payload: BackendSubkategoriResponse): BackendSubkategori {
  if ("data" in payload && payload.data) {
    if ("subkategori" in payload.data && payload.data.subkategori) return payload.data.subkategori;
    return payload.data as BackendSubkategori;
  }

  if ("subkategori" in payload && payload.subkategori) return payload.subkategori;
  return payload as BackendSubkategori;
}

function toBackendPayload(payload: CreateSubkategoriPayload | UpdateSubkategoriPayload) {
  const idKategori = Number.isNaN(Number(payload.idKategori)) ? payload.idKategori : Number(payload.idKategori);

  return {
    id_kategori: idKategori,
    nama: payload.nama
  };
}

export async function getSubkategoriApi(filters: SubkategoriFilters = {}): Promise<PaginatedResponse<Subkategori>> {
  const start = filters.start ?? 0;
  const length = filters.length ?? 20;
  const response = await apiClient.get<BackendListResponse<BackendSubkategori> | BackendSubkategori[]>("/adm/subkategori", {
    params: { start, length, search: filters.search ?? "" }
  });
  const data = listData(response.data).map(mapSubkategori);

  return {
    data,
    meta: {
      page: Math.floor(start / length) + 1,
      limit: length,
      total: totalData(response.data, data.length)
    }
  };
}

export async function getSubkategoriByIdApi(id: string) {
  const response = await apiClient.get<BackendSubkategoriResponse>(`/adm/subkategori/${id}`);
  return mapSubkategori(unwrapSubkategori(response.data));
}

export async function createSubkategoriApi(payload: CreateSubkategoriPayload) {
  const response = await apiClient.post<BackendSubkategoriResponse>("/adm/subkategori", toBackendPayload(payload));
  return mapSubkategori(unwrapSubkategori(response.data));
}

export async function updateSubkategoriApi(id: string, payload: UpdateSubkategoriPayload) {
  const response = await apiClient.put<BackendSubkategoriResponse>(`/adm/subkategori/${id}`, toBackendPayload(payload));
  return mapSubkategori(unwrapSubkategori(response.data));
}

export async function deleteSubkategoriApi(id: string) {
  await apiClient.delete(`/adm/subkategori/${id}`);
}
