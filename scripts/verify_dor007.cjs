const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const printsDir = path.resolve('qa/cards/dor007-escala-plantonistas/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://localhost:5173/?rota=fisc-escala...');
  await page.goto('http://localhost:5173/?rota=fisc-escala', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Print 01: Tela inicial de Cadastro de Escala
  await page.screenshot({ path: path.join(printsDir, 'Print 01 - Tela Inicial Cadastro de Escala TL001.png'), fullPage: true });
  console.log('Saved Print 01');

  // Adicionar segundo plantonista via seletor
  const selectPlantonistaBtn = page.locator('button:has-text("Selecione um técnico plantonista")');
  if (await selectPlantonistaBtn.count() > 0) {
    await selectPlantonistaBtn.click();
    await page.waitForTimeout(300);
    // Clicar em Roberto Alves Mendonça
    await page.locator('text=Roberto Alves Mendonça').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Adicionar Plantonista")').click();
    await page.waitForTimeout(400);
  }

  // Preencher dados do motorista da semana e opcionais
  const motoristaInput = page.locator('input[placeholder="Nome do motorista"]');
  await motoristaInput.fill('Valdir de Jesus Santos');
  const telMotoristaInput = page.locator('input[placeholder="(71) 90000-0000"]');
  await telMotoristaInput.fill('(71) 98711-2233');

  // Print 02: Escala com múltiplos plantonistas e motorista
  await page.screenshot({ path: path.join(printsDir, 'Print 02 - Multiplos Plantonistas e Telefones Integrados.png'), fullPage: true });
  console.log('Saved Print 02');

  // Clicar em Salvar (BOT001)
  const saveBtn = page.locator('button:has-text("Salvar (BOT001)")');
  await saveBtn.click();
  await page.waitForTimeout(600);

  // Print 03: Modal de Sucesso MSG002
  await page.screenshot({ path: path.join(printsDir, 'Print 03 - Confirmacao de Gravacao MSG002.png'), fullPage: true });
  console.log('Saved Print 03');

  // Fechar modal
  await page.locator('button:has-text("OK")').click();
  await page.waitForTimeout(400);

  // Clicar em uma escala já cadastrada no card da direita para recuperar (RN012 / RN015)
  const escalaCard = page.locator('text=ESC-2026-002').first();
  await escalaCard.click();
  await page.waitForTimeout(600);

  // Print 04: Recuperação e Modo Edição RN012/RN015
  await page.screenshot({ path: path.join(printsDir, 'Print 04 - Recuperacao e Edicao de Escala RN012.png'), fullPage: true });
  console.log('Saved Print 04');

  await browser.close();
  console.log('Finished DOR007 verification successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
