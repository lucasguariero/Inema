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

  console.log('1. Selecionando O Próprio Requerente...');
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(2500);

  // Inspecionar o que apareceu nos comboboxes
  const cbs = await page.locator('[role="combobox"]').all();
  console.log('Comboboxes after selecting Tipo de Responsável:', cbs.length);
  for (let i = 0; i < cbs.length; i++) {
    console.log(`Combobox ${i} text:`, (await cbs[i].innerText()).trim());
  }

  // Clicar no primeiro combobox (Tipo de Atividade)
  console.log('Abrindo combobox 0...');
  await cbs[0].click();
  await page.waitForTimeout(1000);
  const options0 = await page.locator('[role="option"]').allInnerTexts();
  console.log('Opções no combobox 0:', options0);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Clicar no segundo combobox (Empreendimento)
  console.log('Abrindo combobox 1...');
  await cbs[1].click();
  await page.waitForTimeout(1000);
  const options1 = await page.locator('[role="option"]').allInnerTexts();
  console.log('Opções no combobox 1:', options1);
  await page.keyboard.press('Escape');

  await browser.close();
})();
