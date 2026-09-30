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

  console.log('2. Selecionando Tipo de Atividade (Silos e Armazéns)...');
  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(600);
  const searchTati = page.locator('input[type="search"]:visible, input[placeholder*="pesquisar"]:visible').first();
  if (await searchTati.isVisible()) {
    await searchTati.fill('Silos');
    await page.waitForTimeout(600);
  }
  await page.locator('[role="option"]:visible').first().click();
  await page.waitForTimeout(1500);

  console.log('3. Selecionando Empreendimento...');
  await page.locator('button#form\\.ansa_empr_id').click();
  await page.waitForTimeout(600);
  const searchEmpr = page.locator('input[type="search"]:visible, input[placeholder*="pesquisar"]:visible').first();
  if (await searchEmpr.isVisible()) {
    await searchEmpr.fill('Fazenda');
    await page.waitForTimeout(600);
  }
  await page.locator('[role="option"]:visible').first().click();
  await page.waitForTimeout(1500);

  console.log('Valores após seleção:');
  console.log('Tati button:', (await page.locator('button#form\\.ansa_tati_id').innerText()).trim());
  console.log('Empr button:', (await page.locator('button#form\\.ansa_empr_id').innerText()).trim());

  console.log('4. Marcando checkbox de declaração...');
  const cbs = await page.locator('input[type="checkbox"]').all();
  for (const cb of cbs) {
    if (await cb.isVisible()) {
      await cb.check();
      console.log('Checkbox marcado!');
    }
  }
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/screenshots/step1-ready.png' });

  console.log('5. Clicando em Próximo...');
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);

  console.log('Etapa atual após clicar Próximo:');
  const activeStep = await page.locator('.fi-wizard-step[aria-current="step"], [aria-current="step"]').allInnerTexts();
  console.log('Active step:', activeStep);

  // Inspecionar seções visíveis na etapa 2
  const step2Text = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('Text in step 2 (first 800 chars):', step2Text.substring(0, 800).replace(/\n/g, ' '));

  await page.screenshot({ path: 'qa/screenshots/step2-active.png' });

  await browser.close();
})();
