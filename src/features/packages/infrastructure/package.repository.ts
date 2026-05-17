import type { IPackageRepository } from "../domain/IPackageRepository.interface";
import { getAdminQuizzesApi, getStudentQuizzesApi, startStudentQuizApi } from "./package.api";

export const packageRepository: IPackageRepository = {
  async getAll() {
    return getAdminQuizzesApi();
  },
  async getAvailableForStudent() {
    return getStudentQuizzesApi();
  },
  async startStudentQuiz(packageId) {
    return startStudentQuizApi(packageId);
  },
  async getAccess() {
    return [];
  }
};
