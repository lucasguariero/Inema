const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Acessando Cadastro ANSLA ---');
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar selects e opções
  const selects = await page.locator('select').all();
  console.log('Select elements found:', selects.length);
  for (const s of selects) {
    const id = await s.getAttribute('id');
    const name = await s.getAttribute('name');
    const opts = await s.locator('option').allInnerTexts();
    console.log(`Select id=${id} name=${name}:`, opts);
  }

  // Se não forem tags <select>, inspecionar comboboxes do Filament
  const comboboxes = await page.locator('[role="combobox"]').all();
  console.log('Comboboxes count:', comboboxes.length);
  for (const cb of comboboxes) {
    const text = (await cb.innerText()).trim();
    console.log('Combobox text:', text);
  }

  await page.screenshot({ path: 'qa/screenshots/step1-dados-basicos.png' });
  await browser.close();
})();
