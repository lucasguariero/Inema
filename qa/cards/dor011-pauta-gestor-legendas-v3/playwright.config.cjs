const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: __dirname, testMatch: '**/refino.spec.cjs',
  timeout: 30000, workers: 1,
  outputDir: './resultados-playwright',
  reporter: [['list'], ['json', { outputFile: __dirname + '/logs/playwright-resultados.json' }]],
  use: { channel: 'chrome', headless: true, viewport: { width: 1920, height: 1080 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' }
});

