import { expect, test, type Page, type Route } from "@playwright/test";

const apiBase = "https://test-bsi.jolly.my.id";

const adminUser = {
  id: 1,
  fb_uid: null,
  fb_provider: null,
  name: "Admin Quiz BSI",
  role: "admin",
  username: "admin",
  last_login_at: null,
  created_at: "2026-05-15T01:00:00.000Z",
  updated_at: "2026-05-15T01:00:00.000Z"
};

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function mockBackend(page: Page) {
  let users = [
    { id: 1, name: "Admin Quiz BSI", username: "admin", role: "admin", is_verified: true, created_at: "2026-05-15T01:00:00.000Z" },
    { id: 2, name: "Peserta Baru", username: "peserta.baru", role: "peserta", is_verified: false, created_at: "2026-05-15T02:00:00.000Z" },
    { id: 3, name: "Peserta Aktif", username: "peserta.aktif", role: "peserta", is_verified: true, created_at: "2026-05-15T03:00:00.000Z" }
  ];

  await page.route(`${apiBase}/login`, async (route) => {
    await json(route, { message: "Login berhasil", data: { token: "admin-token", user: adminUser } });
  });

  await page.route(`${apiBase}/adm/quiz**`, async (route) => {
    await json(route, { data: [] });
  });

  await page.route(`${apiBase}/adm/user/*`, async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    const segments = pathname.split("/");
    const isVerify = pathname.endsWith("/verify");
    const id = Number(segments.at(isVerify ? -2 : -1));

    if (request.method() === "POST" && isVerify) {
      users = users.map((user) => (user.id === id ? { ...user, is_verified: true } : user));
      await json(route, { success: true });
      return;
    }

    if (request.method() === "DELETE") {
      users = users.filter((user) => user.id !== id);
      await json(route, { success: true });
      return;
    }

    await json(route, { data: users.find((user) => user.id === id) });
  });

  await page.route(`${apiBase}/adm/user**`, async (route) => {
    const request = route.request();
    const url = new URL(route.request().url());
    const pathname = url.pathname;
    const segments = pathname.split("/");
    const id = Number(segments.at(pathname.endsWith("/verify") ? -2 : -1));

    if (request.method() === "POST" && pathname.endsWith("/verify")) {
      users = users.map((user) => (user.id === id ? { ...user, is_verified: true } : user));
      await json(route, { success: true });
      return;
    }

    if (request.method() === "DELETE") {
      users = users.filter((user) => user.id !== id);
      await json(route, { success: true });
      return;
    }

    if (pathname !== "/adm/user") {
      await route.fallback();
      return;
    }

    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const showMode = url.searchParams.get("show_mode") ?? "";
    const role = url.searchParams.get("role") ?? "";
    const filtered = users.filter((user) => {
      if (search && !`${user.name} ${user.username}`.toLowerCase().includes(search)) return false;
      if (showMode === "verified" && !user.is_verified) return false;
      if (showMode === "unverified" && user.is_verified) return false;
      if (role && role !== "all" && user.role !== role) return false;
      return true;
    });

    await json(route, { data: filtered, recordsFiltered: filtered.length, recordsTotal: filtered.length });
  });
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Masuk Admin" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Week 2 User Management", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test("admin can list, filter, verify, delete, and open user detail", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/users");
    await expect(page.getByRole("heading", { name: "Manajemen User" })).toBeVisible();
    await expect(page.getByText("Peserta Baru")).toBeVisible();
    await expect(page.getByText("Peserta Aktif")).toBeVisible();

    await page.getByRole("button", { name: /Belum Verifikasi/ }).click();
    await expect(page.getByText("Peserta Baru")).toBeVisible();
    await expect(page.getByText("Peserta Aktif")).toBeHidden();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByText("Peserta Baru")).toBeHidden();

    await page.getByRole("button", { name: /Terverifikasi/ }).click();
    await expect(page.getByText("Peserta Baru")).toBeVisible();

    await page.getByRole("row", { name: /Peserta Baru/ }).getByRole("link", { name: "Detail" }).click();
    await expect(page).toHaveURL(/\/users\/2$/);
    await expect(page.getByRole("heading", { name: "Detail User" })).toBeVisible();
    await expect(page.getByText("peserta.baru")).toBeVisible();

    await page.getByRole("link", { name: "Kembali" }).click();
    await expect(page).toHaveURL(/\/users$/);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Hapus" }).first().click();
    await expect(page.getByText("Peserta Baru")).toBeHidden();
  });
});
