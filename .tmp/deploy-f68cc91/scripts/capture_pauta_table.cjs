const { chromium } = require('@playwright/test');
const path = require('path');

async function captureTable() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4173/?rota=relatorios', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Acompanhamento da pauta")');
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(__dirname, '..', 'prints_regulacao', '07_acompanhamento_pauta_tabela.png') });
  await browser.close();
}

captureTable();
