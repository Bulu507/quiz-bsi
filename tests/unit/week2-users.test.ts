import { beforeEach, describe, expect, it, vi } from "vitest";

const apiClientMock = {
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn()
};

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: apiClientMock
}));

describe("Week 2 User Management API", () => {
  beforeEach(() => {
    apiClientMock.get.mockReset();
    apiClientMock.post.mockReset();
    apiClientMock.delete.mockReset();
  });

  it("maps paginated users from /adm/user", async () => {
    const { getUsersApi } = await import("@/features/users/infrastructure/user.api");
    apiClientMock.get.mockResolvedValueOnce({
      data: {
        data: [
          { id: 2, name: "Peserta Baru", username: "peserta.baru", role: "peserta", is_verified: 0 },
          { id: 3, nama: "Admin", username: "admin", role: "admin", verified_at: "2026-05-15T01:00:00.000Z" }
        ],
        recordsFiltered: 2
      }
    });

    const result = await getUsersApi({ start: 20, length: 20, search: "peserta", showMode: "unverified", role: "peserta" });

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/user", {
      params: { start: 20, length: 20, search: "peserta", show_mode: "unverified", role: "peserta" }
    });
    expect(result.meta).toEqual({ page: 2, limit: 20, total: 2 });
    expect(result.data[0]).toMatchObject({ id: "2", name: "Peserta Baru", role: "peserta", isVerified: false });
    expect(result.data[1]).toMatchObject({ id: "3", name: "Admin", role: "admin", isVerified: true });
  });

  it("maps user detail and calls verify/delete endpoints", async () => {
    const { deleteUserApi, getUserByIdApi, verifyUserApi } = await import("@/features/users/infrastructure/user.api");
    apiClientMock.get.mockResolvedValueOnce({ data: { data: { id: 2, name: "Peserta Baru", username: "peserta.baru", role: "peserta", verified: true } } });

    await expect(getUserByIdApi("2")).resolves.toMatchObject({ id: "2", isVerified: true });
    await verifyUserApi("2");
    await deleteUserApi("2");

    expect(apiClientMock.get).toHaveBeenCalledWith("/adm/user/2");
    expect(apiClientMock.post).toHaveBeenCalledWith("/adm/user/2/verify");
    expect(apiClientMock.delete).toHaveBeenCalledWith("/adm/user/2");
  });
});
