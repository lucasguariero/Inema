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
  // Localizar combobox de ansa_tati_id
  const cbTati = page.locator('[wire\\:model*="ansa_tati_id"], div:has(> label[for="form.ansa_tati_id"]) button[role="combobox"], button#form\\.ansa_tati_id').first();
  if (await cbTati.count() > 0) {
    await cbTati.click();
  } else {
    // Clicar pelo label
    await page.locator('label[for="form.ansa_tati_id"]').click();
    await page.locator('button[role="combobox"]').first().click();
  }
  await page.waitForTimeout(1000);
  await page.locator('[role="option"]:has-text("SILOS E ARMAZÉNS")').first().click();
  await page.waitForTimeout(1500);

  console.log('3. Selecionando Empreendimento...');
  const cbEmpr = page.locator('div:has(> label[for="form.ansa_empr_id"]) button[role="combobox"]').first();
  if (await cbEmpr.count() > 0) {
    await cbEmpr.click();
  } else {
    await page.locator('label[for="form.ansa_empr_id"]').click();
    await page.locator('button[role="combobox"]').last().click();
  }
  await page.waitForTimeout(1000);
  const optEmpr = page.locator('[role="option"]:has-text("Fazenda"), [role="option"]:has-text("Demo"), [role="option"]:has-text("Empreendimento")').first();
  console.log('Empreendimento selecionado:', await optEmpr.innerText());
  await optEmpr.click();
  await page.waitForTimeout(1500);

  console.log('4. Marcando declarações...');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  console.log('Checkboxes count:', checkboxes.length);
  for (const cb of checkboxes) {
    if (!(await cb.isChecked())) {
      await cb.check();
      await page.waitForTimeout(300);
    }
  }

  await page.screenshot({ path: 'qa/screenshots/step1-filled.png' });

  console.log('5. Clicando em Próximo...');
  await page.getByRole('button', { name: /próximo|avançar/i }).click();
  await page.waitForTimeout(3000);

  console.log('URL após avançar:', page.url());
  const mainText = await page.locator('main').innerText();
  console.log('Main text da etapa 2:\n', mainText.substring(0, 1500));

  await page.screenshot({ path: 'qa/screenshots/step2-caracterizacao.png' });
  await browser.close();
})();
