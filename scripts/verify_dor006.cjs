const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const printsDir = path.resolve('qa/cards/dor006-cadastro-plantonista/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5173/?rota=fisc-plantonista...');
  await page.goto('http://localhost:5173/?rota=fisc-plantonista', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Print 01: Tela inicial de Cadastro de Plantonista
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Tela Inicial Cadastro de Plantonista.png'), fullPage: true });
  console.log('Saved Print 01');

  // Test CPF autofill / search via search icon button
  const cpfInput = page.locator('input[placeholder*="000.000.000-00"]');
  await cpfInput.fill('345.678.901-22');
  
  // Click search icon button next to CPF
  const searchButtons = page.locator('button[title="Buscar no cadastro básico"]');
  await searchButtons.nth(1).click();
  await page.waitForTimeout(500);

  // Fill Telefone Institucional
  const telInst = page.locator('input[placeholder="(71) 3118-0000"]');
  await telInst.fill('(71) 3118-4500');

  // Select UR via FilamentSelect
  const urBtn = page.locator('button:has-text("Selecione a Unidade Regional")');
  await urBtn.click();
  await page.waitForTimeout(300);
  await page.locator('div[role="option"]:has-text("UR Salvador"), button:has-text("UR Salvador")').first().click();
  await page.waitForTimeout(300);

  // Select municipality via FilamentSelect
  const munBtn = page.locator('button:has-text("Escolha um município")');
  await munBtn.click();
  await page.waitForTimeout(300);
  // Search or click option
  const munSearchInput = page.locator('input[placeholder*="Buscar"]');
  if (await munSearchInput.count() > 0) {
    await munSearchInput.fill('Camaçari');
    await page.waitForTimeout(300);
    await page.locator('text=Camaçari').first().click();
  } else {
    await page.locator('text=Salvador').first().click();
  }
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Adicionar")').click();
  await page.waitForTimeout(400);

  // Print 02: Recuperação de Servidor da base e preenchimento
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Recuperacao e Preenchimento de Servidor.png'), fullPage: true });
  console.log('Saved Print 02');

  // Click Salvar (BOT001)
  const saveBtn = page.locator('button:has-text("Salvar (BOT001)")');
  await saveBtn.click();
  await page.waitForTimeout(600);

  // Print 03: Modal MSG001 Sucesso
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Confirmacao de Gravacao MSG001.png'), fullPage: true });
  console.log('Saved Print 03');

  // Close modal
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Click on a registered plantonista from the right-hand list to test recovery RN010
  const registeredCard = page.locator('text=Carlos Eduardo Silveira').first();
  await registeredCard.click();
  await page.waitForTimeout(600);

  // Print 04: Modo Edição RN010 com campos protegidos
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Modo Edicao e Recuperacao RN010.png'), fullPage: true });
  console.log('Saved Print 04');

  await browser.close();
  console.log('Finished DOR006 verification successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
