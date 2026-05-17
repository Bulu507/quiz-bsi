import { expect, test, type Page, type Route } from "@playwright/test";

const apiBase = "https://test-bsi.jolly.my.id";

const questionOne = {
  id: "question-1",
  categoryId: "twk",
  categoryName: "TWK",
  subcategoryId: "pancasila",
  createdBy: "user-1",
  type: "PG",
  text: "Rumusan dasar negara yang disampaikan pada sidang BPUPKI menjadi bagian penting dalam lahirnya Pancasila.",
  imageUrl: null,
  difficulty: "SEDANG",
  tags: ["pancasila", "nasionalisme"],
  explanation: "Pancasila digunakan sebagai ideologi dan dasar negara.",
  explanationImageUrl: null,
  options: [
    { id: "a", label: "A", text: "Dasar hukum tertulis negara", imageUrl: null, isCorrect: false, scoreValue: 0 },
    { id: "b", label: "B", text: "Ideologi dan dasar negara", imageUrl: null, isCorrect: true, scoreValue: 1 },
    { id: "c", label: "C", text: "Pedoman teknis pemerintahan daerah", imageUrl: null, isCorrect: false, scoreValue: 0 },
    { id: "d", label: "D", text: "Sumber peraturan kementerian", imageUrl: null, isCorrect: false, scoreValue: 0 }
  ],
  status: "DRAFT",
  createdAt: "2026-05-15T01:00:00.000Z",
  updatedAt: "2026-05-15T01:00:00.000Z"
};

const questionTwo = {
  ...questionOne,
  id: "question-2",
  categoryId: "tiu",
  categoryName: "TIU",
  subcategoryId: "aritmetika",
  text: "Jika 2 + 3 = ...",
  difficulty: "MUDAH",
  status: "PUBLISHED",
  tags: ["aritmetika"],
  options: [
    { id: "a", label: "A", text: "4", imageUrl: null, isCorrect: false, scoreValue: 0 },
    { id: "b", label: "B", text: "5", imageUrl: null, isCorrect: true, scoreValue: 1 },
    { id: "c", label: "C", text: "6", imageUrl: null, isCorrect: false, scoreValue: 0 },
    { id: "d", label: "D", text: "7", imageUrl: null, isCorrect: false, scoreValue: 0 }
  ]
};

const questions = [questionOne, questionTwo];
const categories = [
  { id: "twk", nama: "TWK" },
  { id: "tiu", nama: "TIU" },
  { id: "tkp", nama: "TKP" }
];
const subcategories = [
  { id: "pancasila", id_kategori: "twk", nama: "Pancasila" },
  { id: "nasionalisme", id_kategori: "twk", nama: "Nasionalisme" },
  { id: "aritmetika", id_kategori: "tiu", nama: "Aritmetika" }
];

function toBackendQuestion(question: typeof questionOne) {
  return {
    id: question.id,
    id_kategori: question.categoryId,
    id_subkat: question.subcategoryId,
    kategori: { id: question.categoryId, nama: question.categoryName },
    content: question.text,
    pembahasan: question.explanation,
    options: question.options.map((option) => ({
      id: option.id,
      content: option.text,
      poin: option.scoreValue
    })),
    status: question.status,
    difficulty: question.difficulty,
    type: question.type,
    created_at: question.createdAt,
    updated_at: question.updatedAt
  };
}

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockBackend(page: Page) {
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

  await page.route(`${apiBase}/adm/soal/question-1`, async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await json(route, { success: true, message: "OK", data: toBackendQuestion(questionOne) });
      return;
    }

    if (method === "PUT") {
      const payload = await route.request().postDataJSON();
      await json(route, {
        success: true,
        message: "Updated",
        data: { ...toBackendQuestion(questionOne), content: payload.content, pembahasan: payload.pembahasan, options: payload.options }
      });
      return;
    }

    await route.fallback();
  });

  await page.route(`${apiBase}/adm/kategori**`, async (route) => {
    await json(route, { data: categories });
  });

  await page.route(`${apiBase}/adm/subkategori**`, async (route) => {
    await json(route, { data: subcategories });
  });

  await page.route(`${apiBase}/adm/soal**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname !== "/adm/soal") {
      await route.fallback();
      return;
    }

    if (request.method() === "POST" && url.pathname === "/adm/soal") {
      const payload = await request.postDataJSON();
      await json(route, {
        success: true,
        message: "Created",
        data: {
          id: "question-new",
          id_kategori: "tiu",
          id_subkat: payload.id_subkat,
          kategori: { id: "tiu", nama: "TIU" },
          content: payload.content,
          pembahasan: payload.pembahasan,
          options: payload.options,
          status: "DRAFT",
          difficulty: "SEDANG",
          type: "PG",
          created_at: "2026-05-15T02:00:00.000Z",
          updated_at: "2026-05-15T02:00:00.000Z"
        }
      });
      return;
    }

    const search = url.searchParams.get("search")?.toLowerCase();
    const categoryId = url.searchParams.get("id_kategori");
    const filtered = questions.filter((question) => {
      if (search && !question.text.toLowerCase().includes(search)) return false;
      if (categoryId && question.categoryId !== categoryId) return false;
      return true;
    });

    await json(route, {
      data: filtered.map(toBackendQuestion),
      meta: {
        page: Number(url.searchParams.get("page") ?? 1),
        limit: Number(url.searchParams.get("length") ?? 10),
        total: filtered.length
      }
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

test.describe("Week 2 Questions", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test("anonymous user is redirected from questions to login", async ({ page }) => {
    await page.goto("/questions");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("admin can open question bank and filter questions", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/questions");
    await expect(page.getByRole("heading", { name: "Bank Soal" })).toBeVisible();
    await expect(page.getByText(questionOne.text)).toBeVisible();
    await expect(page.getByText(questionTwo.text)).toBeVisible();

    await page.getByLabel("Cari teks soal").fill("2 + 3");
    await expect(page.getByText(questionTwo.text)).toBeVisible();
    await expect(page.getByText(questionOne.text)).toBeHidden();

    await page.getByLabel("Cari teks soal").fill("");
    await page.getByLabel("Kesulitan").selectOption("MUDAH");
    await expect(page.getByText(questionTwo.text)).toBeVisible();
    await expect(page.getByText(questionOne.text)).toBeHidden();
  });

  test("admin can open create question form and submit a draft", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/questions/new");
    await expect(page.getByText("Metadata")).toBeVisible();
    await expect(page.getByText("Pilihan Jawaban")).toBeVisible();

    await page.getByLabel("Teks soal").fill("Jika 2 + 3 = ...");
    await page.getByLabel("Pilihan A").fill("4");
    await page.getByLabel("Pilihan B").fill("5");
    await page.getByLabel("Pilihan C").fill("6");
    await page.getByLabel("Pilihan D").fill("7");
    await page.getByLabel("Jawaban benar B").check();
    await page.getByLabel("Pembahasan").fill("2 + 3 sama dengan 5.");
    await page.getByLabel("Tags").fill("tiu, aritmetika");
    await page.getByRole("button", { name: "Simpan Draft" }).click();

    await expect(page).toHaveURL(/\/questions$/);
  });

  test("admin can open edit question form and save changes", async ({ page }) => {
    await loginAsAdmin(page);

    await page.goto("/questions/question-1");
    await expect(page.getByRole("heading", { name: "Edit Soal" })).toBeVisible();
    await expect(page.getByLabel("Teks soal")).toContainText("Rumusan dasar");
    await page.getByLabel("Teks soal").fill("Rumusan dasar negara adalah bagian dari sejarah Pancasila.");
    await page.getByRole("button", { name: "Simpan & Publish" }).click();

    await expect(page).toHaveURL(/\/questions$/);
  });
});
