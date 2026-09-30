const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('1. Selecionando Tipo de Responsável...');
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(1500);

  console.log('2. Selecionando Tipo de Atividade (SILOS)...');
  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(800);
  // Type in the search input to filter to Silos
  const searchInputs = page.locator('input[type="search"]:visible, input[placeholder*="pesquis"]:visible, input[placeholder*="Comece"]:visible');
  const searchCount = await searchInputs.count();
  console.log('Search inputs visible:', searchCount);
  if (searchCount > 0) {
    await searchInputs.first().fill('SILOS');
    await page.waitForTimeout(800);
  }
  // List all visible options
  const opts = await page.locator('[role="option"]:visible').allInnerTexts();
  console.log('Options after filter:', opts);
  // Click the SILOS option
  const silosOption = page.locator('[role="option"]:visible:has-text("SILOS")');
  if (await silosOption.count() > 0) {
    await silosOption.first().click();
    console.log('Clicked SILOS option');
  } else {
    console.log('SILOS option not found, clicking first visible');
    await page.locator('[role="option"]:visible').first().click();
  }
  await page.waitForTimeout(2000);

  // Verify what was selected
  const tatiText = (await page.locator('button#form\\.ansa_tati_id').innerText()).trim();
  console.log('Tipo de Atividade selected:', tatiText);

  console.log('3. Selecionando Empreendimento (Fazenda Demo ANSLA)...');
  await page.locator('button#form\\.ansa_empr_id').click();
  await page.waitForTimeout(800);
  const searchInputs2 = page.locator('input[type="search"]:visible, input[placeholder*="pesquis"]:visible, input[placeholder*="Comece"]:visible');
  if (await searchInputs2.count() > 0) {
    await searchInputs2.first().fill('Fazenda Demo');
    await page.waitForTimeout(800);
  }
  const emprOpts = await page.locator('[role="option"]:visible').allInnerTexts();
  console.log('Empreendimento options:', emprOpts);
  const fazendaOpt = page.locator('[role="option"]:visible:has-text("Fazenda Demo ANSLA")');
  if (await fazendaOpt.count() > 0) {
    await fazendaOpt.first().click();
    console.log('Clicked Fazenda Demo ANSLA');
  } else {
    await page.locator('[role="option"]:visible').first().click();
    console.log('Clicked first empreendimento option');
  }
  await page.waitForTimeout(1500);

  const emprText = (await page.locator('button#form\\.ansa_empr_id').innerText()).trim();
  console.log('Empreendimento selected:', emprText);

  console.log('4. Marcando checkbox de declaração...');
  const checkbox = page.locator('input[type="checkbox"]:visible');
  if (await checkbox.count() > 0) {
    await checkbox.first().check();
    console.log('Checkbox checked');
  }
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'qa/screenshots/ansla-step1-silos.png' });

  console.log('5. Clicando Próximo...');
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);

  // Check step 2 content
  const step2Text = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('Step 2 text (first 2000 chars):\n', step2Text.substring(0, 2000));

  await page.screenshot({ path: 'qa/screenshots/ansla-step2-silos.png' });

  await browser.close();
})();
