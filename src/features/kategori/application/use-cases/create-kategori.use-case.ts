import type { IKategoriRepository } from "../../domain/IKategoriRepository.interface";
import type { CreateKategoriPayload } from "../../domain/kategori.types";

export function createKategoriUseCase(repository: IKategoriRepository, payload: CreateKategoriPayload) {
  if (!payload.nama.trim()) throw new Error("Nama kategori wajib diisi.");
  return repository.create({ nama: payload.nama.trim() });
}
