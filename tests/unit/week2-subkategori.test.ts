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

describe("Week 2 Subkategori API", () => {
  beforeEach(() => {
    apiClientMock.get.mockReset();
    apiClientMock.post.mockReset();
    apiClientMock.put.mockReset();
    apiClientMock.delete.mockReset();
  });

  it("maps paginated subcategories from /adm/subkategori", async () => {
    const { getSubkategoriApi } = await import("@/features/subkategori/infrastructure/subkategori.api");
    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 21, id_kategori: 1, nama: "Nasionalisme", kategori: { id: 1, nama: "TWK" }, jumlah_soal: 10 },
          { id: 22, kategori_id: 2, name: "Numerik", kategori: "TIU", question_count: 12 }
        ],
        recordsFiltered: 2
      }
    });

    const result = await getSubkategoriApi({ start: 20, length: 20, search: "n" });

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/subkategori", {
      params: { start: 20, length: 20, search: "n" }
    });
    expect(result.meta).toEqual({ page: 2, limit: 20, total: 2 });
    expect(result.data[0]).toMatchObject({ id: "21", idKategori: "1", nama: "Nasionalisme", namaKategori: "TWK", jumlahSoal: 10 });
    expect(result.data[1]).toMatchObject({ id: "22", idKategori: "2", nama: "Numerik", namaKategori: "TIU", jumlahSoal: 12 });
  });

  it("maps subcategory detail and calls create/update/delete endpoints", async () => {
    const { createSubkategoriApi, deleteSubkategoriApi, getSubkategoriByIdApi, updateSubkategoriApi } = await import(
      "@/features/subkategori/infrastructure/subkategori.api"
    );

    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: {
          id: 21,
          id_kategori: 1,
          nama: "Nasionalisme",
          kategori: { id: 1, nama: "TWK" },
          jumlah_soal: 10
        }
      }
    });
    apiClientMock.post.mockResolvedValueOnce({ data: { data: { id: 23, id_kategori: 1, nama: "Pancasila" } } });
    apiClientMock.put.mockResolvedValueOnce({ data: { data: { id: 21, id_kategori: 2, nama: "Nasionalisme Updated" } } });

    await expect(getSubkategoriByIdApi("21")).resolves.toMatchObject({ id: "21", idKategori: "1", nama: "Nasionalisme" });
    await expect(createSubkategoriApi({ idKategori: "1", nama: "Pancasila" })).resolves.toMatchObject({ id: "23", nama: "Pancasila" });
    await expect(updateSubkategoriApi("21", { idKategori: "2", nama: "Nasionalisme Updated" })).resolves.toMatchObject({
      id: "21",
      idKategori: "2",
      nama: "Nasionalisme Updated"
    });
    await deleteSubkategoriApi("21");

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/subkategori/21");
    expect(apiClientMock.post).toHaveBeenCalledWith("/adm/subkategori", { id_kategori: 1, nama: "Pancasila" });
    expect(apiClientMock.put).toHaveBeenCalledWith("/adm/subkategori/21", { id_kategori: 2, nama: "Nasionalisme Updated" });
    expect(apiClientMock.delete).toHaveBeenCalledWith("/adm/subkategori/21");
  });
});
