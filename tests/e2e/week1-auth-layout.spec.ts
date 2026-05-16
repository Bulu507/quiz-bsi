import { expect, test, type Page, type Route } from "@playwright/test";

const apiBase = "https://test-bsi.jolly.my.id";
const cookieUrl = "http://127.0.0.1:3100";

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockAuthBackend(page: Page) {
  await page.route(`${apiBase}/login`, async (route) => {
    await json(route, {
      message: "Login berhasil",
      data: {
        token: "admin-token",
        user: {
          id: 1,
          fb_uid: null,
          fb_provider: null,
          name: "Admin Quiz BSI",
          role: "admin",
          username: "admin",
          last_login_at: null,
          created_at: "2026-05-15T01:00:00.000Z",
          updated_at: "2026-05-15T01:00:00.000Z"
        }
      }
    });
  });

  await page.route(`${apiBase}/adm/quiz**`, async (route) => {
    await json(route, { data: [] });
  });
}

async function setSession(page: Page, role: "ADMIN" | "PESERTA") {
  await page.context().addCookies([
    {
      name: "quiz-bsi-token",
      value: `${role.toLowerCase()}-token`,
      url: cookieUrl
    },
    {
      name: "quiz-bsi-role",
      value: role,
      url: cookieUrl
    }
  ]);
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin");
  await page.getByRole("button", { name: "Masuk Admin" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Week 1 Auth, Guard, and Layout", () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthBackend(page);
  });

  test("anonymous user is redirected from home to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk Admin" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Masuk dengan Google" })).toBeVisible();
  });

  test("admin login persists session and opens instructor dashboard", async ({ page }) => {
    await loginAsAdmin(page);

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Bank Soal" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Paket Ujian" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Kelas" })).toBeVisible();
    await expect(page.getByText("Total Murid")).toBeVisible();

    await expect(page.evaluate(() => window.localStorage.getItem("quiz-bsi-token"))).resolves.toBe("admin-token");
    await expect(page.evaluate(() => window.localStorage.getItem("quiz-bsi-role"))).resolves.toBe("ADMIN");
  });

  test("authenticated admin is redirected away from public auth pages", async ({ page }) => {
    await setSession(page, "ADMIN");

    await page.goto("/login");
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/register");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("peserta can open student dashboard and cannot open admin routes", async ({ page }) => {
    await setSession(page, "PESERTA");

    await page.goto("/student/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard Peserta" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Riwayat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Join Kelas" })).toBeVisible();
    await expect(page.getByText("Paket Ujian Tersedia")).toBeVisible();

    await page.goto("/questions");
    await expect(page).toHaveURL(/\/student\/dashboard$/);
  });

  test("admin cannot open peserta routes", async ({ page }) => {
    await setSession(page, "ADMIN");

    await page.goto("/student/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/join");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("logout clears admin session and returns to login", async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.evaluate(() => window.localStorage.getItem("quiz-bsi-token"))).resolves.toBeNull();
    await expect(page.evaluate(() => window.localStorage.getItem("quiz-bsi-role"))).resolves.toBeNull();
  });
});
