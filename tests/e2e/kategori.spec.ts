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
  let categories = [
    {
      id: 1,
      nama: "TWK",
      jumlah_subkategori: 1,
      subkategori: [{ id: 11, nama: "Nasionalisme", jumlah_soal: 10 }],
      created_at: "2026-05-15T01:00:00.000Z"
    },
    {
      id: 2,
      nama: "TIU",
      jumlah_subkategori: 1,
      subkategori: [{ id: 21, nama: "Numerik", jumlah_soal: 12 }],
      created_at: "2026-05-15T02:00:00.000Z"
    }
  ];
  let nextId = 3;

  await page.route(`${apiBase}/login`, async (route) => {
    await json(route, { message: "Login berhasil", data: { token: "admin-token", user: adminUser } });
  });

  await page.route(`${apiBase}/adm/quiz**`, async (route) => {
    await json(route, { data: [] });
  });

  await page.route(`${apiBase}/adm/kategori**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const segments = url.pathname.split("/");
    const id = Number(segments.at(-1));

    if (url.pathname === "/adm/kategori" && request.method() === "GET") {
      const search = url.searchParams.get("search")?.toLowerCase() ?? "";
      const filtered = categories.filter((category) => category.nama.toLowerCase().includes(search));
      await json(route, { data: filtered, recordsFiltered: filtered.length, recordsTotal: filtered.length });
      return;
    }

    if (url.pathname === "/adm/kategori" && request.method() === "POST") {
      const body = (await request.postDataJSON()) as { nama: string };
      const created = { id: nextId++, nama: body.nama, jumlah_subkategori: 0, subkategori: [], created_at: "2026-05-17T01:00:00.000Z" };
      categories = [...categories, created];
      await json(route, { data: created });
      return;
    }

    if (request.method() === "GET") {
      await json(route, { data: categories.find((category) => category.id === id) });
      return;
    }

    if (request.method() === "PUT") {
      const body = (await request.postDataJSON()) as { nama: string };
      categories = categories.map((category) => (category.id === id ? { ...category, nama: body.nama } : category));
      await json(route, { data: categories.find((category) => category.id === id) });
      return;
    }

    if (request.method() === "DELETE") {
      categories = categories.filter((category) => category.id !== id);
      await json(route, { success: true });
      return;
    }

    await json(route, { message: "Unhandled kategori route" }, 404);
  });
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Masuk Admin" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Week 2 Kategori", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test("admin can list, create, search, edit, open detail, and delete kategori", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/kategori");
    await expect(page.getByRole("heading", { name: "Kategori Soal" })).toBeVisible();
    await expect(page.getByText("TWK")).toBeVisible();
    await expect(page.getByText("TIU")).toBeVisible();

    await page.getByLabel("Nama kategori baru").fill("TKP");
    await page.getByRole("button", { name: "Tambah Kategori" }).click();
    await expect(page.getByText("TKP")).toBeVisible();

    await page.getByLabel("Cari kategori").fill("TIU");
    await expect(page.getByText("TIU")).toBeVisible();
    await expect(page.getByText("TWK")).toBeHidden();

    await page.getByLabel("Cari kategori").fill("");
    const twkRow = page.getByRole("row", { name: /TWK/ });
    await twkRow.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Edit nama kategori").fill("TWK Updated");
    await page.getByRole("button", { name: "Simpan" }).click();
    await expect(page.getByText("TWK Updated")).toBeVisible();

    await page.getByRole("row", { name: /TWK Updated/ }).getByRole("link", { name: "Detail" }).click();
    await expect(page).toHaveURL(/\/kategori\/1$/);
    await expect(page.getByRole("heading", { name: "Detail Kategori" })).toBeVisible();
    await expect(page.getByText("Nasionalisme")).toBeVisible();

    await page.getByRole("link", { name: "Kembali" }).click();
    await expect(page).toHaveURL(/\/kategori$/);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("row", { name: /TWK Updated/ }).getByRole("button", { name: "Hapus" }).click();
    await expect(page.getByText("TWK Updated")).toBeHidden();
  });
});
