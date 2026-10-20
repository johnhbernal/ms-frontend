// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // The app detects the browser locale (es* → es-CO, en* → en). A headless runner
    // defaults to en-US, which flipped the UI to English and made the es-CO copy
    // assertions fail on machines whose browser is not Spanish. Pin the locale so the
    // gate measures the app, not the runner's language.
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Call the Vite binary directly instead of `npm run dev`: on Windows npm spawns
    // `cmd -> node`, Playwright kills the shell and the Vite child survives holding
    // :3000, so every spec printed and the runner never returned (a hung gate is worse
    // than a red one). One node process is killable; `--strictPort` fails loudly
    // instead of drifting to 3001.
    command: 'node node_modules/vite/bin/vite.js --port 3000 --strictPort',
    url: 'http://localhost:3000',
    // Prefer reusing a local dev server (common while validating UX). GitHub Actions starts fresh.
    reuseExistingServer: process.env.PW_FORCE_WEB_SERVER === '1' ? false : true,
    timeout: 120_000,
    // Ask for a graceful stop before the kill, so `npm run ci:local` exits and :3000 is freed.
    gracefulShutdown: { signal: 'SIGTERM', timeout: 1_000 },
  },
});
