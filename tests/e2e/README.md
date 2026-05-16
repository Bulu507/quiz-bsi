# E2E Tests

Playwright tests untuk flow Week 2 Questions.

## Setup

Install dependency dan browser Playwright:

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm run test:e2e
```

Mode UI:

```bash
npm run test:e2e:ui
```

Jika dev server sudah berjalan sendiri:

```bash
PLAYWRIGHT_START_SERVER=0 npm run test:e2e
```

## Notes

- Test mem-mock API `https://test-bsi.jolly.my.id` lewat `page.route`, jadi tidak bergantung ke backend aktif.
- Playwright akan menjalankan Next dev server otomatis pada port `3100`.
- Untuk mengganti port, set env `PLAYWRIGHT_PORT`.
