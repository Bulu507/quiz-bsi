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

describe("Week 2 Kategori API", () => {
  beforeEach(() => {
    apiClientMock.get.mockReset();
    apiClientMock.post.mockReset();
    apiClientMock.put.mockReset();
    apiClientMock.delete.mockReset();
  });

  it("maps paginated categories from /adm/kategori", async () => {
    const { getKategoriApi } = await import("@/features/kategori/infrastructure/kategori.api");
    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 1, nama: "TWK", jumlah_subkategori: 2 },
          { id: 2, name: "TIU", subcategories: [{ id: "21", name: "Numerik", question_count: 12 }] }
        ],
        recordsFiltered: 2
      }
    });

    const result = await getKategoriApi({ start: 20, length: 20, search: "t" });

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/kategori", {
      params: { start: 20, length: 20, search: "t" }
    });
    expect(result.meta).toEqual({ page: 2, limit: 20, total: 2 });
    expect(result.data[0]).toMatchObject({ id: "1", nama: "TWK", jumlahSubkategori: 2 });
    expect(result.data[1]).toMatchObject({ id: "2", nama: "TIU", jumlahSubkategori: 1 });
    expect(result.data[1].subkategori[0]).toMatchObject({ id: "21", nama: "Numerik", jumlahSoal: 12 });
  });

  it("maps category detail and calls create/update/delete endpoints", async () => {
    const { createKategoriApi, deleteKategoriApi, getKategoriByIdApi, updateKategoriApi } = await import(
      "@/features/kategori/infrastructure/kategori.api"
    );

    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: {
          id: 1,
          nama: "TWK",
          subkategori: [{ id: 11, nama: "Nasionalisme", jumlah_soal: 10 }],
          created_at: "2026-05-15T01:00:00.000Z"
        }
      }
    });
    apiClientMock.post.mockResolvedValueOnce({ data: { data: { id: 3, nama: "TKP" } } });
    apiClientMock.put.mockResolvedValueOnce({ data: { data: { id: 1, nama: "TWK Updated" } } });

    await expect(getKategoriByIdApi("1")).resolves.toMatchObject({
      id: "1",
      nama: "TWK",
      subkategori: [{ id: "11", nama: "Nasionalisme", jumlahSoal: 10 }]
    });
    await expect(createKategoriApi({ nama: "TKP" })).resolves.toMatchObject({ id: "3", nama: "TKP" });
    await expect(updateKategoriApi("1", { nama: "TWK Updated" })).resolves.toMatchObject({ id: "1", nama: "TWK Updated" });
    await deleteKategoriApi("1");

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/kategori/1");
    expect(apiClientMock.post).toHaveBeenCalledWith("/adm/kategori", { nama: "TKP" });
    expect(apiClientMock.put).toHaveBeenCalledWith("/adm/kategori/1", { nama: "TWK Updated" });
    expect(apiClientMock.delete).toHaveBeenCalledWith("/adm/kategori/1");
  });
});
