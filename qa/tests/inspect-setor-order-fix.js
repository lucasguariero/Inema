const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Abrir edição do ANSLA-001 e ir na aba Setor
  await page.goto('https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas/1/edit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Indo na aba Setor de ANSLA-001...');
  await page.getByRole('tab', { name: 'Setor' }).click();
  await page.waitForTimeout(1500);

  const setorContent = await page.locator('main').innerText();
  console.log('Conteúdo da aba Setor no ANSLA-001:\n', setorContent);

  // 2. Abrir tela de Create e clicar em "Adicionar Setor"
  await page.goto('https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.getByRole('tab', { name: 'Setor' }).click();
  await page.waitForTimeout(1000);

  console.log('\nClicando em Adicionar Setor...');
  const addSetorBtn = page.getByRole('button', { name: /Adicionar Setor/i }).first();
  await addSetorBtn.click();
  await page.waitForTimeout(1500);

  const afterAddSetor = await page.locator('main').innerText();
  console.log('Após clicar em Adicionar Setor:\n', afterAddSetor);

  // Clicar novamente para adicionar um segundo setor
  await addSetorBtn.click();
  await page.waitForTimeout(1500);

  const afterAddSecond = await page.locator('main').innerText();
  console.log('\nApós adicionar o segundo setor:\n', afterAddSecond);

  await page.screenshot({ path: 'qa/screenshots/teste-01-setores.png' });

  await browser.close();
})();
