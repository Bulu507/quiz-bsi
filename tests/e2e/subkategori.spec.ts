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
  const categories = [
    { id: 1, nama: "TWK" },
    { id: 2, nama: "TIU" }
  ];
  let subcategories = [
    { id: 21, id_kategori: 1, nama: "Nasionalisme", kategori: { id: 1, nama: "TWK" }, jumlah_soal: 10 },
    { id: 22, id_kategori: 2, nama: "Numerik", kategori: { id: 2, nama: "TIU" }, jumlah_soal: 12 }
  ];
  let nextId = 23;

  await page.route(`${apiBase}/login`, async (route) => {
    await json(route, { message: "Login berhasil", data: { token: "admin-token", user: adminUser } });
  });

  await page.route(`${apiBase}/adm/quiz**`, async (route) => {
    await json(route, { data: [] });
  });

  await page.route(`${apiBase}/adm/kategori**`, async (route) => {
    await json(route, { data: categories, recordsFiltered: categories.length, recordsTotal: categories.length });
  });

  await page.route(`${apiBase}/adm/subkategori**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const segments = url.pathname.split("/");
    const id = Number(segments.at(-1));

    if (url.pathname === "/adm/subkategori" && request.method() === "GET") {
      const search = url.searchParams.get("search")?.toLowerCase() ?? "";
      const filtered = subcategories.filter((subcategory) => subcategory.nama.toLowerCase().includes(search));
      await json(route, { data: filtered, recordsFiltered: filtered.length, recordsTotal: filtered.length });
      return;
    }

    if (url.pathname === "/adm/subkategori" && request.method() === "POST") {
      const body = (await request.postDataJSON()) as { id_kategori: number; nama: string };
      const category = categories.find((item) => item.id === Number(body.id_kategori));
      const created = {
        id: nextId++,
        id_kategori: body.id_kategori,
        nama: body.nama,
        kategori: category,
        jumlah_soal: 0
      };
      subcategories = [...subcategories, created];
      await json(route, { data: created });
      return;
    }

    if (request.method() === "GET") {
      await json(route, { data: subcategories.find((subcategory) => subcategory.id === id) });
      return;
    }

    if (request.method() === "PUT") {
      const body = (await request.postDataJSON()) as { id_kategori: number; nama: string };
      const category = categories.find((item) => item.id === Number(body.id_kategori));
      subcategories = subcategories.map((subcategory) =>
        subcategory.id === id ? { ...subcategory, id_kategori: body.id_kategori, nama: body.nama, kategori: category } : subcategory
      );
      await json(route, { data: subcategories.find((subcategory) => subcategory.id === id) });
      return;
    }

    if (request.method() === "DELETE") {
      subcategories = subcategories.filter((subcategory) => subcategory.id !== id);
      await json(route, { success: true });
      return;
    }

    await json(route, { message: "Unhandled subkategori route" }, 404);
  });
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Masuk Admin" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Week 2 Subkategori", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test("admin can list, create, search, edit, open detail, and delete subkategori", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/subkategori");
    await expect(page.getByRole("heading", { name: "Subkategori Soal" })).toBeVisible();
    await expect(page.getByText("Nasionalisme")).toBeVisible();
    await expect(page.getByText("Numerik")).toBeVisible();

    await page.getByLabel("Kategori subkategori baru").selectOption("1");
    await page.getByLabel("Nama subkategori baru").fill("Pancasila");
    await page.getByRole("button", { name: "Tambah Subkategori" }).click();
    await expect(page.getByText("Pancasila")).toBeVisible();

    await page.getByLabel("Cari subkategori").fill("Numerik");
    await expect(page.getByText("Numerik")).toBeVisible();
    await expect(page.getByText("Nasionalisme")).toBeHidden();

    await page.getByLabel("Cari subkategori").fill("");
    const row = page.getByRole("row", { name: /Nasionalisme/ });
    await row.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Edit kategori subkategori").selectOption("2");
    await page.getByLabel("Edit nama subkategori").fill("Nasionalisme Updated");
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText("Nasionalisme Updated")).toBeVisible();

    await page.getByRole("row", { name: /Nasionalisme Updated/ }).getByRole("link", { name: "Detail" }).click();
    await expect(page).toHaveURL(/\/subkategori\/21$/);
    await expect(page.getByRole("heading", { name: "Detail Subkategori" })).toBeVisible();
    await expect(page.getByText("TIU")).toBeVisible();

    await page.getByRole("link", { name: "Kembali" }).click();
    await expect(page).toHaveURL(/\/subkategori$/);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("row", { name: /Nasionalisme Updated/ }).getByRole("button", { name: "Hapus" }).click();
    await expect(page.getByText("Nasionalisme Updated")).toBeHidden();
  });
});
