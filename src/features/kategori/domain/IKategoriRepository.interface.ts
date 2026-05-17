import type { PaginatedResponse } from "@/shared/types/common.types";
import type { CreateKategoriPayload, Kategori, KategoriFilters, UpdateKategoriPayload } from "./kategori.types";

export interface IKategoriRepository {
  getAll(filters?: KategoriFilters): Promise<PaginatedResponse<Kategori>>;
  getById(id: string): Promise<Kategori>;
  create(payload: CreateKategoriPayload): Promise<Kategori>;
  update(id: string, payload: UpdateKategoriPayload): Promise<Kategori>;
  delete(id: string): Promise<void>;
}
