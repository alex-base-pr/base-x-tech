import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT || 4173);
// QA_BASE_URL lets the same suite run against dev.base-xtech.com or a preview deploy.
const baseURL = process.env.QA_BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: './qa/tests',
  outputDir: './qa/results',
  fullyParallel: true,
  // One retry absorbs load-related timing flakes (sliders, third-party widgets); Playwright still reports them as 'flaky'.
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'qa/report', open: 'never' }]],
  use: { baseURL },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, grep: /@cross/ },
  ],
  webServer: process.env.QA_BASE_URL ? undefined : {
    command: `node qa/serve.mjs dist`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: true,
  },
});
