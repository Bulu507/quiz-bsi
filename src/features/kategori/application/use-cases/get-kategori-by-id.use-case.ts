import type { IKategoriRepository } from "../../domain/IKategoriRepository.interface";

export function getKategoriByIdUseCase(repository: IKategoriRepository, id: string) {
  return repository.getById(id);
}
