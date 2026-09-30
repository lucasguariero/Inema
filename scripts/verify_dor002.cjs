const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const printsDir = path.resolve('qa/cards/dor002-autorizacao-visitacao-uc/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5173/?rota=uc-autorizacao-visitacao...');
  await page.goto('http://localhost:5173/?rota=uc-autorizacao-visitacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Print 01: Painel de Processos AAV TL007 com SLA e status
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Painel de Processos AAV TL007 com SLA 20 dias.png'), fullPage: true });
  console.log('Saved Print 01');

  // Clicar em "Analisar" no primeiro processo
  await page.locator('button:has-text("Analisar")').first().click();
  await page.waitForTimeout(600);

  // Print 02: Análise Técnica TL005, Instrução Documental F-DUC-066 e Checklist
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Analise Tecnica TL005 e Instrucao Documental F-DUC-066.png'), fullPage: true });
  console.log('Saved Print 02');

  // Clicar em Emitir Portaria de Autorização
  await page.locator('button:has-text("Emitir Portaria de Autorização (MSG008)")').click();
  await page.waitForTimeout(600);

  // Print 03: Modal MSG008 com emissão de portaria
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Modal de Emissao de Portaria MSG008.png'), fullPage: true });
  console.log('Saved Print 03');

  // Fechar modal
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Print 04: Estado de Autorização Emitida com Portaria formal
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Portaria Emitida e Disponibilizada TL006.png'), fullPage: true });
  console.log('Saved Print 04');

  await browser.close();
  console.log('Finished DOR002 verification successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
