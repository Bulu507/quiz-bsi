import type { IKategoriRepository } from "../../domain/IKategoriRepository.interface";
import type { UpdateKategoriPayload } from "../../domain/kategori.types";

export function updateKategoriUseCase(repository: IKategoriRepository, id: string, payload: UpdateKategoriPayload) {
  if (!payload.nama.trim()) throw new Error("Nama kategori wajib diisi.");
  return repository.update(id, { nama: payload.nama.trim() });
}
