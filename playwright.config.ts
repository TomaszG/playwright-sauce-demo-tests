import { defineConfig, devices, selectors } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['dot'], ['github'], ['html', { outputDir: './test-results' }]]
    : [['list'], ['html', { outputDir: './test-results' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
})
