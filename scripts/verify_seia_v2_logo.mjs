import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // 1. Expanded view
  await page.goto('http://localhost:4188/?rota=seia-v2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'qa/seia-v2-shadcn-verification/10-seia-v2-expanded-logo.png' });

  // 2. Click toggle button on TOPBAR to collapse
  await page.click('header button[title="Recolher menu lateral"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'qa/seia-v2-shadcn-verification/11-seia-v2-collapsed-icon.png' });

  // 3. Tabela screen
  await page.goto('http://localhost:4188/?rota=seia-v2&tela=tabela', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'qa/seia-v2-shadcn-verification/12-seia-v2-tabela-breadcrumb.png' });

  await browser.close();
  console.log('Captures completed successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
