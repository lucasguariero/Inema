const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function verifyDOR004() {
  const outputDir = path.resolve('qa/cards/dor004-pesquisa-cientifica-uc/prints');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to Pesquisa Científica page...');
  await page.goto('http://localhost:5173/?rota=uc-pesquisa-cientifica', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Print 01: Painel Gerencial (TL001 / TL007)
  console.log('Capturing Print 01...');
  await page.screenshot({
    path: path.join(outputDir, 'Print 01 - Painel de Pesquisas Cientificas TL001 TL007.png'),
    fullPage: false
  });

  // Switch to Novo Projeto
  console.log('Switching to Novo Projeto tab...');
  await page.click('button:has-text("Novo Projeto")');
  await page.waitForTimeout(800);

  // Print 02: Formulário Dados Gerais e UC (TL002)
  console.log('Capturing Print 02...');
  await page.screenshot({
    path: path.join(outputDir, 'Print 02 - Requerimento de Pesquisa Dados Gerais e UC TL002.png'),
    fullPage: false
  });

  // Fill title and move to Step 2 & 3
  await page.fill('input[placeholder*="Título completo do projeto"]', 'Monitoramento da Biodiversidade e Conservação de Fragmentos Florestais');
  await page.click('button:has-text("Avançar para Instituição e Equipe")');
  await page.waitForTimeout(500);

  await page.click('button:has-text("Avançar para Coleta e Salvaguardas")');
  await page.waitForTimeout(500);

  // Toggle coleta
  await page.click('#checkColeta');
  await page.waitForTimeout(400);

  // Print 03: Coleta, Salvaguardas e Fiel Depositário (TL004 / RN009, RN010)
  console.log('Capturing Print 03...');
  await page.screenshot({
    path: path.join(outputDir, 'Print 03 - Coleta de Especimes e Fiel Depositario RN009 RN010.png'),
    fullPage: false
  });

  // Move through steps to Step 5
  await page.click('button:has-text("Avançar para Cronograma & Localização")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Avançar para Instrução Documental")');
  await page.waitForTimeout(500);

  // Trigger Confirmation Modal
  await page.click('button:has-text("Enviar e Protocolar no SEI-BA")');
  await page.waitForTimeout(500);

  // Print 04: Modal de Confirmação (MSG002)
  console.log('Capturing Print 04...');
  await page.screenshot({
    path: path.join(outputDir, 'Print 04 - Confirmacao de Protocolo SEI-BA MSG002.png'),
    fullPage: false
  });

  // Confirm submission
  await page.click('button:has-text("Confirmar e Protocolar")');
  await page.waitForTimeout(600);

  // Close success modal and go to Painel
  await page.click('button:has-text("Ir para o Painel de Pesquisas")');
  await page.waitForTimeout(800);

  // Click "Analisar" button on the newly created process in the table
  await page.locator('button:has-text("Analisar")').first().click();
  await page.waitForTimeout(500);

  // Deliberate Deferimento in modal
  await page.click('button:has-text("Deferir (Emitir Portaria)")');
  await page.fill('textarea[placeholder*="Registre os fundamentos"]', 'Projeto de pesquisa de relevante interesse público e ambiental. Conformidade atestada com o zoneamento do Plano de Manejo do PESC e Portaria INEMA 25.753/2022.');
  await page.click('button:has-text("Salvar Deliberação")');
  await page.waitForTimeout(800);

  // Now view the authorized act
  await page.locator('button:has-text("Ver Ato")').first().click();
  await page.waitForTimeout(800);

  // Print 05: Portaria Oficial Emitida e Relatórios (TL006 / TL007 / RN011, RN012)
  console.log('Capturing Print 05...');
  await page.screenshot({
    path: path.join(outputDir, 'Print 05 - Portaria de Autorizacao e Relatorios TL006 TL007.png'),
    fullPage: false
  });

  console.log('Verification finished successfully!');
  await browser.close();
}

verifyDOR004().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
