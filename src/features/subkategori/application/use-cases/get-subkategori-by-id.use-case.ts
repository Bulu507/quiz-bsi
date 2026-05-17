import type { ISubkategoriRepository } from "../../domain/ISubkategoriRepository.interface";

export function getSubkategoriByIdUseCase(repository: ISubkategoriRepository, id: string) {
  return repository.getById(id);
}
