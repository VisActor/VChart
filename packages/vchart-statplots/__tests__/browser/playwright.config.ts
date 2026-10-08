import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: __dirname,
  testMatch: '*.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 30000,
  outputDir: path.resolve(__dirname, '../../../../.vchart-statplots/test-results'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.resolve(__dirname, '../../../../.vchart-statplots/report'), open: 'never' }]
  ],
  use: {
    browserName: 'chromium',
    headless: true,
    baseURL: 'http://127.0.0.1:4178',
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run start -- --mode test --port 4178 --strictPort',
    url: 'http://127.0.0.1:4178/__tests__/browser/page.html',
    reuseExistingServer: false
  }
});
