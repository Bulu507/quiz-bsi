import type { ISubkategoriRepository } from "../../domain/ISubkategoriRepository.interface";
import type { CreateSubkategoriPayload } from "../../domain/subkategori.types";

export function createSubkategoriUseCase(repository: ISubkategoriRepository, payload: CreateSubkategoriPayload) {
  if (!payload.idKategori.trim()) throw new Error("Kategori wajib dipilih.");
  if (!payload.nama.trim()) throw new Error("Nama subkategori wajib diisi.");

  return repository.create({ idKategori: payload.idKategori, nama: payload.nama.trim() });
}
