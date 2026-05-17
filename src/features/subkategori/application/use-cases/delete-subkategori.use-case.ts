import type { ISubkategoriRepository } from "../../domain/ISubkategoriRepository.interface";

export function deleteSubkategoriUseCase(repository: ISubkategoriRepository, id: string) {
  return repository.delete(id);
}
