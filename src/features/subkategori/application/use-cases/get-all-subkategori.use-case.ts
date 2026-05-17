import type { ISubkategoriRepository } from "../../domain/ISubkategoriRepository.interface";
import type { SubkategoriFilters } from "../../domain/subkategori.types";

export function getAllSubkategoriUseCase(repository: ISubkategoriRepository, filters?: SubkategoriFilters) {
  return repository.getAll(filters);
}
