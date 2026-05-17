import type { ISubkategoriRepository } from "../domain/ISubkategoriRepository.interface";
import type { CreateSubkategoriPayload, UpdateSubkategoriPayload } from "../domain/subkategori.types";
import { createSubkategoriApi, deleteSubkategoriApi, getSubkategoriApi, getSubkategoriByIdApi, updateSubkategoriApi } from "./subkategori.api";

export const subkategoriRepository: ISubkategoriRepository = {
  async getAll(filters) {
    return getSubkategoriApi(filters);
  },
  async getById(id) {
    return getSubkategoriByIdApi(id);
  },
  async create(payload: CreateSubkategoriPayload) {
    return createSubkategoriApi(payload);
  },
  async update(id: string, payload: UpdateSubkategoriPayload) {
    return updateSubkategoriApi(id, payload);
  },
  async delete(id) {
    return deleteSubkategoriApi(id);
  }
};
