import { existsSync } from "node:fs";
import { expect, test, type Page, type Route } from "@playwright/test";

const apiBase = "https://test-bsi.jolly.my.id";
const excelFixture = "E:\\Bank Soal Import Gambar2.xlsx";

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
  await page.route(`${apiBase}/login`, async (route) => {
    await json(route, { message: "Login berhasil", data: { token: "admin-token", user: adminUser } });
  });

  await page.route(`${apiBase}/adm/quiz**`, async (route) => {
    await json(route, { data: [] });
  });

  await page.route(`${apiBase}/adm/kategori**`, async (route) => {
    await json(route, {
      data: [{ id: 1, nama: "TWK" }],
      recordsFiltered: 1,
      recordsTotal: 1
    });
  });

  await page.route(`${apiBase}/adm/subkategori**`, async (route) => {
    await json(route, {
      data: [{ id: 21, id_kategori: 1, nama: "Nasionalisme", jumlah_soal: 0 }],
      recordsFiltered: 1,
      recordsTotal: 1
    });
  });

  await page.route(`${apiBase}/adm/soal/import`, async (route) => {
    await json(route, {
      success: true,
      message: "Import soal berhasil",
      data: { imported: 2 }
    });
  });
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Masuk Admin" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Week 2 Question Import", () => {
  test.skip(!existsSync(excelFixture), `File fixture tidak ditemukan: ${excelFixture}`);

  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test("admin sees success state when Excel import succeeds without preview rows", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/questions/import");
    await expect(page.getByRole("heading", { name: "Import Excel" })).toBeVisible();
    await page.getByLabel("Subkategori").selectOption("21");

    await page.getByLabel("File import soal").setInputFiles(excelFixture);

    await expect(page.getByText("Import soal berhasil (2 soal)")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Import berhasil" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kembali ke Bank Soal" })).toBeVisible();
  });
});
