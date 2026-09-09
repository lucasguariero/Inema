const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './qa/tests',
  timeout: 60000,
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
});
