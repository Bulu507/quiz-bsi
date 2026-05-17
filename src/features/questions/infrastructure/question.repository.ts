import type { CreateQuestionPayload, IQuestionRepository, UpdateQuestionPayload } from "../domain/IQuestionRepository.interface";
import {
  confirmQuestionsImportApi,
  createQuestionApi,
  deleteQuestionApi,
  getQuestionByIdApi,
  getQuestionCategoriesApi,
  getQuestionSubcategoriesApi,
  getQuestionsApi,
  updateQuestionApi,
  uploadQuestionsExcelApi
} from "./question.api";

export const questionRepository: IQuestionRepository = {
  async getAll(filters) {
    return getQuestionsApi(filters);
  },
  async getById(id) {
    return getQuestionByIdApi(id);
  },
  async create(payload: CreateQuestionPayload) {
    return createQuestionApi(payload);
  },
  async update(id: string, payload: UpdateQuestionPayload) {
    return updateQuestionApi(id, payload);
  },
  async delete(id) {
    return deleteQuestionApi(id);
  },
  async uploadExcel(file, subcategoryId) {
    return uploadQuestionsExcelApi(file, subcategoryId);
  },
  async confirmImport(jobId) {
    return confirmQuestionsImportApi(jobId);
  },
  async getCategories() {
    return getQuestionCategoriesApi();
  },
  async getSubcategories(categoryId) {
    return getQuestionSubcategoriesApi(categoryId);
  }
};
