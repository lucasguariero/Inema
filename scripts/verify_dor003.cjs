const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const printsDir = path.resolve('qa/cards/dor003-atividades-didaticas-uc/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5173/?rota=uc-atividades-didaticas...');
  await page.goto('http://localhost:5173/?rota=uc-atividades-didaticas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Print 01: Painel de Processos AAD TL007
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Painel de Processos AAD TL007.png'), fullPage: true });
  console.log('Saved Print 01');

  // Abrir aba Solicitar AAD
  await page.locator('button:has-text("Solicitar AAD (Novo)")').click();
  await page.waitForTimeout(600);

  // Print 02: Form AAD Tipo 1 Sem Coleta
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Formulario AAD Tipo 1 Sem Coleta RN009.png'), fullPage: true });
  console.log('Saved Print 02');

  // Clicar em AAD Tipo 2 Com Coleta
  await page.locator('text=AAD Tipo 2 — Com Coleta / Captura (RN010)').click();
  await page.waitForTimeout(500);

  // Print 03: Form AAD Tipo 2 com especificação de coleta e depósito científico
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Formulario AAD Tipo 2 Com Coleta e Deposito RN010.png'), fullPage: true });
  console.log('Saved Print 03');

  // Submeter solicitação (BOT001)
  await page.locator('button:has-text("Submeter Solicitação AAD (BOT001)")').click();
  await page.waitForTimeout(600);

  // Print 04: Modal MSG003 Confirmação
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Confirmacao de Protocolo MSG003.png'), fullPage: true });
  console.log('Saved Print 04');

  // Fechar modal
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Abrir aba Análise e Decisão
  await page.locator('button:has-text("Análise e Decisão (TL005/006)")').click();
  await page.waitForTimeout(600);

  // Clicar em Deferir e Emitir Autorização
  await page.locator('button:has-text("Deferir e Emitir Autorização (MSG008)")').click();
  await page.waitForTimeout(600);

  // Fechar modal MSG008
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Print 05: Autorização emitida com número oficial
  await page.screenshot({ path: path.join(printsDir, 'Print 05 - Autorizacao Didatica Emitida TL006.png'), fullPage: true });
  console.log('Saved Print 05');

  await browser.close();
  console.log('Finished DOR003 verification successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
