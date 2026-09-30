const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureLogin() {
  const outputDir = path.join(__dirname, '../qa/login-screens');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  const { preview } = require('vite');
  const server = await preview({
    preview: { port: 4198 },
  });

  console.log('Navigating to SEIA V2 Login (Light)...');
  await page.goto('http://localhost:4198/?rota=seia-v2&tela=login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '01-login-seia-v2-light-1080p.png') });

  console.log('Toggling Dark Mode...');
  // Click theme toggle button
  await page.click('button[title*="escuro"]');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outputDir, '02-login-seia-v2-dark-1080p.png') });

  // Mobile viewport
  console.log('Capturing Mobile viewport...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '03-login-seia-v2-mobile.png') });

  await browser.close();
  await server.close();
  console.log('Login screenshots saved successfully!');
}

captureLogin().catch((err) => {
  console.error(err);
  process.exit(1);
});
