import type { IQuestionRepository } from "../domain/IQuestionRepository.interface";
import type { Question } from "../domain/question.types";

const questions: Question[] = [
  {
    id: "question-1",
    categoryId: "twk",
    categoryName: "TWK",
    subcategoryId: "pancasila",
    createdBy: "user-1",
    type: "PG",
    text: "Nilai dasar yang menjadi sumber dari segala sumber hukum di Indonesia tercermin pada sila...",
    imageUrl: null,
    difficulty: "SEDANG",
    tags: ["pancasila", "nasionalisme"],
    explanation: "Pancasila digunakan sebagai dasar nilai dalam kehidupan berbangsa.",
    explanationImageUrl: null,
    options: [
      { id: "a", label: "A", text: "Ketuhanan Yang Maha Esa", imageUrl: null, isCorrect: false, scoreValue: 1 },
      { id: "b", label: "B", text: "Kemanusiaan yang adil", imageUrl: null, isCorrect: true, scoreValue: 1 },
      { id: "c", label: "C", text: "Persatuan Indonesia", imageUrl: null, isCorrect: false, scoreValue: 1 },
      { id: "d", label: "D", text: "Keadilan sosial", imageUrl: null, isCorrect: false, scoreValue: 1 }
    ],
    status: "PUBLISHED",
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z"
  },
  {
    id: "question-2",
    categoryId: "tiu",
    categoryName: "TIU",
    subcategoryId: "aritmetika",
    createdBy: "user-1",
    type: "PG",
    text: "Jika 12 pekerja menyelesaikan pekerjaan dalam 8 hari, maka 16 pekerja menyelesaikan pekerjaan dalam...",
    imageUrl: null,
    difficulty: "MUDAH",
    tags: ["tiu", "perbandingan"],
    explanation: "Gunakan perbandingan berbalik nilai.",
    explanationImageUrl: null,
    options: [
      { id: "a", label: "A", text: "5 hari", imageUrl: null, isCorrect: false, scoreValue: 1 },
      { id: "b", label: "B", text: "6 hari", imageUrl: null, isCorrect: true, scoreValue: 1 },
      { id: "c", label: "C", text: "7 hari", imageUrl: null, isCorrect: false, scoreValue: 1 },
      { id: "d", label: "D", text: "9 hari", imageUrl: null, isCorrect: false, scoreValue: 1 }
    ],
    status: "PUBLISHED",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z"
  }
];

export const questionRepository: IQuestionRepository = {
  async getAll(filters) {
    const search = filters?.search?.toLowerCase();
    const filtered = questions.filter((question) => {
      if (search && !question.text.toLowerCase().includes(search)) return false;
      if (filters?.categoryId && question.categoryId !== filters.categoryId) return false;
      if (filters?.difficulty && question.difficulty !== filters.difficulty) return false;
      if (filters?.status && question.status !== filters.status) return false;
      return true;
    });

    return {
      data: filtered,
      meta: { page: filters?.page ?? 1, limit: filters?.limit ?? 10, total: filtered.length }
    };
  },
  async getById(id) {
    const question = questions.find((item) => item.id === id);
    if (!question) throw new Error("Question not found");
    return question;
  },
  async create(payload) {
    return { ...payload, id: "question-new", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },
  async update(id, payload) {
    const current = await this.getById(id);
    return { ...current, ...payload, updatedAt: new Date().toISOString() };
  },
  async delete() {
    return undefined;
  },
  async uploadExcel() {
    return { success: true, message: "Preview ready", data: { jobId: "job-1", preview: [] } };
  },
  async confirmImport() {
    return { success: true, message: "Imported", data: { imported: 45 } };
  },
  async getCategories() {
    return [
      { id: "twk", name: "TWK" },
      { id: "tiu", name: "TIU" },
      { id: "tkp", name: "TKP" }
    ];
  }
};
