import type { IKategoriRepository } from "../../domain/IKategoriRepository.interface";

export function deleteKategoriUseCase(repository: IKategoriRepository, id: string) {
  return repository.delete(id);
}
