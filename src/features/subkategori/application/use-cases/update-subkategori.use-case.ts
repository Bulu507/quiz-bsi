import type { ISubkategoriRepository } from "../../domain/ISubkategoriRepository.interface";
import type { UpdateSubkategoriPayload } from "../../domain/subkategori.types";

export function updateSubkategoriUseCase(repository: ISubkategoriRepository, id: string, payload: UpdateSubkategoriPayload) {
  if (!payload.idKategori.trim()) throw new Error("Kategori wajib dipilih.");
  if (!payload.nama.trim()) throw new Error("Nama subkategori wajib diisi.");

  return repository.update(id, { idKategori: payload.idKategori, nama: payload.nama.trim() });
}
