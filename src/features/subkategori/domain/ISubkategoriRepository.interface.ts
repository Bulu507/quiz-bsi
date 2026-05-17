import type { PaginatedResponse } from "@/shared/types/common.types";
import type { CreateSubkategoriPayload, Subkategori, SubkategoriFilters, UpdateSubkategoriPayload } from "./subkategori.types";

export interface ISubkategoriRepository {
  getAll(filters?: SubkategoriFilters): Promise<PaginatedResponse<Subkategori>>;
  getById(id: string): Promise<Subkategori>;
  create(payload: CreateSubkategoriPayload): Promise<Subkategori>;
  update(id: string, payload: UpdateSubkategoriPayload): Promise<Subkategori>;
  delete(id: string): Promise<void>;
}
