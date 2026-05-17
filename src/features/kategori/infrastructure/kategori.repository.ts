import type { IKategoriRepository } from "../domain/IKategoriRepository.interface";
import type { CreateKategoriPayload, UpdateKategoriPayload } from "../domain/kategori.types";
import { createKategoriApi, deleteKategoriApi, getKategoriApi, getKategoriByIdApi, updateKategoriApi } from "./kategori.api";

export const kategoriRepository: IKategoriRepository = {
  async getAll(filters) {
    return getKategoriApi(filters);
  },
  async getById(id) {
    return getKategoriByIdApi(id);
  },
  async create(payload: CreateKategoriPayload) {
    return createKategoriApi(payload);
  },
  async update(id: string, payload: UpdateKategoriPayload) {
    return updateKategoriApi(id, payload);
  },
  async delete(id) {
    return deleteKategoriApi(id);
  }
};
