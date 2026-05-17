import { apiClient } from "@/shared/lib/api-client";
import type { PaginatedResponse } from "@/shared/types/common.types";
import type { CreateKategoriPayload, Kategori, KategoriFilters, SubkategoriRingkas, UpdateKategoriPayload } from "../domain/kategori.types";

type BackendSubkategori = {
  id?: string | number;
  nama?: string;
  name?: string;
  jumlah_soal?: number;
  total_soal?: number;
  question_count?: number;
};

type BackendKategori = {
  id?: string | number;
  nama?: string;
  name?: string;
  subkategori?: BackendSubkategori[];
  subcategories?: BackendSubkategori[];
  jumlah_subkategori?: number;
  total_subkategori?: number;
  created_at?: string | null;
  updated_at?: string | null;
};

type BackendListResponse<T> = {
  data?: T[] | { data?: T[]; total?: number; recordsTotal?: number; recordsFiltered?: number };
  recordsTotal?: number;
  recordsFiltered?: number;
  total?: number;
};

type BackendKategoriResponse =
  | BackendKategori
  | {
      data?: BackendKategori | { kategori?: BackendKategori };
      kategori?: BackendKategori;
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

function mapSubkategori(subkategori: BackendSubkategori): SubkategoriRingkas {
  return {
    id: String(subkategori.id ?? ""),
    nama: subkategori.nama ?? subkategori.name ?? "-",
    jumlahSoal: subkategori.jumlah_soal ?? subkategori.total_soal ?? subkategori.question_count
  };
}

function mapKategori(kategori: BackendKategori): Kategori {
  const subkategori = (kategori.subkategori ?? kategori.subcategories ?? []).map(mapSubkategori);

  return {
    id: String(kategori.id ?? ""),
    nama: kategori.nama ?? kategori.name ?? "-",
    jumlahSubkategori: kategori.jumlah_subkategori ?? kategori.total_subkategori ?? subkategori.length,
    subkategori,
    createdAt: kategori.created_at ?? null,
    updatedAt: kategori.updated_at ?? null
  };
}

function unwrapKategori(payload: BackendKategoriResponse): BackendKategori {
  if ("data" in payload && payload.data) {
    if ("kategori" in payload.data && payload.data.kategori) return payload.data.kategori;
    return payload.data as BackendKategori;
  }

  if ("kategori" in payload && payload.kategori) return payload.kategori;
  return payload as BackendKategori;
}

export async function getKategoriApi(filters: KategoriFilters = {}): Promise<PaginatedResponse<Kategori>> {
  const start = filters.start ?? 0;
  const length = filters.length ?? 20;
  const response = await apiClient.get<BackendListResponse<BackendKategori> | BackendKategori[]>("/adm/kategori", {
    params: { start, length, search: filters.search ?? "" }
  });
  const data = listData(response.data).map(mapKategori);

  return {
    data,
    meta: {
      page: Math.floor(start / length) + 1,
      limit: length,
      total: totalData(response.data, data.length)
    }
  };
}

export async function getKategoriByIdApi(id: string) {
  const response = await apiClient.get<BackendKategoriResponse>(`/adm/kategori/${id}`);
  return mapKategori(unwrapKategori(response.data));
}

export async function createKategoriApi(payload: CreateKategoriPayload) {
  const response = await apiClient.post<BackendKategoriResponse>("/adm/kategori", payload);
  return mapKategori(unwrapKategori(response.data));
}

export async function updateKategoriApi(id: string, payload: UpdateKategoriPayload) {
  const response = await apiClient.put<BackendKategoriResponse>(`/adm/kategori/${id}`, payload);
  return mapKategori(unwrapKategori(response.data));
}

export async function deleteKategoriApi(id: string) {
  await apiClient.delete(`/adm/kategori/${id}`);
}
