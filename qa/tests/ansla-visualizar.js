const { chromium } = require('playwright');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // ===== PART A: Visualizar registro concluído ANSLA-2026-000032 =====
  console.log('========== PART A: Visualizar ANSLA-2026-000032 (Concluído) ==========');
  
  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on the row for ANSLA-2026-000032
  const row32 = page.locator('tr:has-text("ANSLA-2026-000032"), .fi-ta-row:has-text("ANSLA-2026-000032")').first();
  if (await row32.count() > 0) {
    // Look for Visualizar link in the row or click the row kebab
    const visualizar32 = row32.locator('a:has-text("Visualizar")');
    if (await visualizar32.count() > 0) {
      console.log('Clicking Visualizar for 000032...');
      await visualizar32.click();
    } else {
      console.log('Clicking row for 000032...');
      await row32.click();
    }
    await page.waitForTimeout(3000);
    console.log('URL after click:', page.url());
  }

  // Check the current page
  const vizTitle = await page.title();
  console.log('Visualizar title:', vizTitle);
  const vizText = await page.locator('main').innerText();
  
  // Check key data points
  console.log('\n--- Dados no Visualizar ---');
  console.log('Title contains "Atividade Não Sujeita":', vizTitle.includes('Atividade Não Sujeita') || vizText.includes('Atividade Não Sujeita'));
  console.log('Utiliza água:', vizText.includes('Utiliza') && vizText.includes('água') || vizText.includes('utiliza') && vizText.includes('água'));
  console.log('Caracterização visible:', vizText.includes('Caracterização') || vizText.includes('caracterização'));
  console.log('Unidades Armazenadoras visible:', vizText.includes('Unidade') || vizText.includes('armazenadora'));
  
  console.log('\nVisualizar text (first 3000):', vizText.substring(0, 3000));
  
  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-032.png', fullPage: true });

  // Scroll down and take another screenshot
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-032-mid.png' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-032-bottom.png' });

  // ===== PART B: Editar registro rascunho (persistência) =====
  console.log('\n========== PART B: Persistência - Editar Rascunho ==========');
  
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?record=37', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const editTitle = await page.title();
  console.log('Editar title:', editTitle);
  console.log('[5.2] Editar header OK:', editTitle.includes('Editar Atividade Não Sujeita') || editTitle.includes('Cadastrar'));

  const editText = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('\nEditar text (first 2000):', editText.substring(0, 2000));

  // Check what data is loaded
  const tatiBtn = await page.locator('button#form\\.ansa_tati_id').innerText();
  console.log('Tipo de Atividade loaded:', tatiBtn.trim());

  const emprBtn = await page.locator('button#form\\.ansa_empr_id').innerText();
  console.log('Empreendimento loaded:', emprBtn.trim());

  await page.screenshot({ path: PRINTS_DIR + '/06-editar-rascunho.png' });

  // Try advancing to step 2 to check persisted data
  console.log('\nTrying to go to Step 2...');
  const step2Btn = page.locator('button:has-text("Caracterização da Atividade")');
  if (await step2Btn.count() > 0) {
    await step2Btn.click();
    await page.waitForTimeout(2000);
    const step2Text = await page.locator('form[wire\\:submit="save"]').innerText();
    console.log('Step 2 text (first 2000):', step2Text.substring(0, 2000));
    await page.screenshot({ path: PRINTS_DIR + '/06-editar-step2.png' });
  }

  console.log('\n=== DONE ===');
  await browser.close();
})();
