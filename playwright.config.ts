import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/VeletaFinance/`,
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }, testIgnore: /responsive\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /responsive\.spec\.ts/ },
  ],
  webServer: {
    // Tests run against the production build in demo mode (no Supabase credentials).
    command: `npx vite build --mode e2e && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/VeletaFinance/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '', VITE_BASE_PATH: '/VeletaFinance/' },
  },
})
