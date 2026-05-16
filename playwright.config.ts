import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3100";
const shouldStartServer = process.env.PLAYWRIGHT_START_SERVER !== "0";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  ...(shouldStartServer
    ? {
        webServer: {
          command: `node ./node_modules/next/dist/bin/next dev -p ${port}`,
          url: `http://127.0.0.1:${port}`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000
        }
      }
    : {}),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
