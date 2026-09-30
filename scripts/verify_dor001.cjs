const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const printsDir = path.resolve('qa/cards/dor001-agendamento-visitacao-uc/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5173/?rota=uc-agendamento...');
  await page.goto('http://localhost:5173/?rota=uc-agendamento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Print 01: Formulário F-DUC-069-00 Etapa 1 com Banner RN001
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Form F-DUC-069-00 Etapa 01 e Banner RN001.png'), fullPage: true });
  console.log('Saved Print 01');

  // Avançar para Etapa 4 (Caracterização e Triagem)
  await page.locator('button:has-text("4. Caracterização (TL005)")').click();
  await page.waitForTimeout(500);

  // Print 02: Triagem Normativa AAD/Pesc/AUI (RN011, RN012, RN013)
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Caracterizacao e Triagem Automatica TL005.png'), fullPage: true });
  console.log('Saved Print 02');

  // Avançar para Etapa 7 (Revisão e Envio)
  await page.locator('button:has-text("7. Revisão e Envio (TL008)")').click();
  await page.waitForTimeout(500);

  // Clicar em Enviar Solicitação (BOT001)
  await page.locator('button:has-text("Enviar Solicitação (BOT001)")').click();
  await page.waitForTimeout(600);

  // Print 03: Modal de Confirmação MSG008
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Confirmacao de Envio MSG008.png'), fullPage: true });
  console.log('Saved Print 03');

  // Fechar modal
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Visualizar Pauta do Gestor (TL009)
  await page.locator('button:has-text("Pauta do Gestor (TL009)")').click();
  await page.waitForTimeout(600);

  // Print 04: Pauta do Gestor da UC TL009
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Pauta do Gestor da UC TL009.png'), fullPage: true });
  console.log('Saved Print 04');

  // Visualizar Calendário da UC (TL010)
  await page.locator('button:has-text("Calendário UC (TL010)")').click();
  await page.waitForTimeout(600);

  // Print 05: Calendário de Ocupação da UC TL010
  await page.screenshot({ path: path.join(printsDir, 'Print 05 - Calendario de Ocupacao da UC TL010.png'), fullPage: true });
  console.log('Saved Print 05');

  await browser.close();
  console.log('Finished DOR001 verification successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
