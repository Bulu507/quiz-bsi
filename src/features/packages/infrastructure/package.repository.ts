import type { IPackageRepository } from "../domain/IPackageRepository.interface";
import { getAdminQuizzesApi } from "./package.api";

export const packageRepository: IPackageRepository = {
  async getAll() {
    return getAdminQuizzesApi();
  },
  async getAvailableForStudent() {
    return [];
  },
  async getAccess() {
    return [];
  }
};
