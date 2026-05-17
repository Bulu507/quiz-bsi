import type { IKategoriRepository } from "../../domain/IKategoriRepository.interface";
import type { KategoriFilters } from "../../domain/kategori.types";

export function getAllKategoriUseCase(repository: IKategoriRepository, filters?: KategoriFilters) {
  return repository.getAll(filters);
}
