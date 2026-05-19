import { beforeEach, describe, expect, it, vi } from "vitest";

const apiClientMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: apiClientMock
}));

describe("Week 3 Bank Soal API", () => {
  beforeEach(() => {
    apiClientMock.get.mockReset();
    apiClientMock.post.mockReset();
    apiClientMock.put.mockReset();
    apiClientMock.delete.mockReset();
  });

  it("maps paginated questions from /adm/soal and sends backend filters", async () => {
    const { getQuestionsApi } = await import("@/features/questions/infrastructure/question.api");
    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 1,
            id_kategori: 1,
            id_subkat: 21,
            kategori: { id: 1, nama: "TWK" },
            subkategori: { id: 21, nama: "Nasionalisme" },
            content: "<p>Rumusan dasar negara...</p>",
            pembahasan: "<p>Pembahasan</p>",
            options: [
              { id: 1, content: "A", poin: 0 },
              { id: 2, content: "B", poin: 5 }
            ],
            difficulty: "MUDAH"
          }
        ],
        recordsFiltered: 1
      }
    });

    const result = await getQuestionsApi({ page: 2, limit: 10, search: "rumusan", categoryId: "1", subcategoryId: "21" });

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/soal", {
      params: {
        start: 10,
        length: 10,
        search: "rumusan",
        id_kategori: "1",
        id_subkategori: "21",
        include_opsi: true
      }
    });
    expect(result.meta).toEqual({ page: 2, limit: 10, total: 1 });
    expect(result.data[0]).toMatchObject({
      id: "1",
      categoryId: "1",
      categoryName: "TWK",
      subcategoryId: "21",
      text: "<p>Rumusan dasar negara...</p>",
      difficulty: "MUDAH"
    });
    expect(result.data[0].options[1]).toMatchObject({ label: "B", text: "B", isCorrect: true, scoreValue: 5 });
  });

  it("calls detail, create, update, delete, and import endpoints with backend payloads", async () => {
    const { createQuestionApi, deleteQuestionApi, getQuestionByIdApi, updateQuestionApi, uploadQuestionsExcelApi } = await import(
      "@/features/questions/infrastructure/question.api"
    );
    const payload = {
      categoryId: "1",
      categoryName: "TWK",
      subcategoryId: "21",
      createdBy: "admin",
      type: "PG" as const,
      text: "<p>Soal baru</p>",
      imageUrl: null,
      difficulty: "SEDANG" as const,
      tags: [],
      explanation: "<p>Pembahasan</p>",
      explanationImageUrl: null,
      options: [
        { id: "a", label: "A" as const, text: "Pilihan A", imageUrl: null, isCorrect: false, scoreValue: 0 },
        { id: "b", label: "B" as const, text: "Pilihan B", imageUrl: null, isCorrect: true, scoreValue: 5 }
      ],
    };
    const backendQuestion = {
      id: 1,
      id_kategori: 1,
      id_subkat: 21,
      kategori: { id: 1, nama: "TWK" },
      content: payload.text,
      pembahasan: payload.explanation,
      options: [
        { id: 1, content: "Pilihan A", poin: 0 },
        { id: 2, content: "Pilihan B", poin: 5 }
      ]
    };

    apiClientMock.get.mockResolvedValueOnce({ data: { data: backendQuestion } });
    apiClientMock.post.mockResolvedValueOnce({ data: { data: backendQuestion } }).mockResolvedValueOnce({
      data: { success: true, message: "Import soal berhasil", data: { imported: 2 } }
    });
    apiClientMock.put.mockResolvedValueOnce({ data: { data: backendQuestion } });

    await expect(getQuestionByIdApi("1")).resolves.toMatchObject({ id: "1", subcategoryId: "21" });
    await createQuestionApi(payload);
    await updateQuestionApi("1", payload);
    await deleteQuestionApi("1");
    const file = new File(["fixture"], "bank-soal.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    await expect(uploadQuestionsExcelApi(file, "21")).resolves.toMatchObject({ data: { imported: 2 } });

    const expectedPayload = {
      content: "<p>Soal baru</p>",
      pembahasan: "<p>Pembahasan</p>",
      trik_cepat: null,
      id_subkat: 21,
      options: [
        { content: "Pilihan A", poin: 0 },
        { content: "Pilihan B", poin: 5 }
      ]
    };
    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/soal/1");
    expect(apiClientMock.post).toHaveBeenCalledWith("/adm/soal", expectedPayload);
    expect(apiClientMock.put).toHaveBeenCalledWith("/adm/soal/1", expectedPayload);
    expect(apiClientMock.delete).toHaveBeenCalledWith("/adm/soal/1");
    expect(apiClientMock.post.mock.calls[1][0]).toBe("/adm/soal/import");
    expect(apiClientMock.post.mock.calls[1][1]).toBeInstanceOf(FormData);
  });
});
