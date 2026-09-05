import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 180_000,
  workers: 1,
  use: {
    baseURL: "http://localhost:4189",
    viewport: { width: 1672, height: 941 },
    channel: process.env.PLAYWRIGHT_CHANNEL,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview -- --port 4189 --strictPort",
    url: "http://localhost:4189",
    reuseExistingServer: false,
  },
});
