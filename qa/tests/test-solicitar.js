const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type=\"text\"]').first().fill('00000000000');
  await page.locator('input[type=\"password\"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Acessando /ansla/tela-inicial ---');
  await page.goto('https://gla-inema-hml.acto.com.br/ansla/tela-inicial', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mainText = await page.locator('main').innerText();
  console.log('Tela inicial main text:\n', mainText);

  // Procurar por Silos ou dropdowns
  const options = await page.locator('select option, [role=\"option\"]').allInnerTexts();
  console.log('Options found:', options);

  // Clicar em Solicitar ANSLA se existir
  const btnSolicitar = page.getByRole('button', { name: /solicitar ansla/i }).or(page.getByRole('link', { name: /solicitar ansla/i }));
  console.log('Btn Solicitar count:', await btnSolicitar.count());
  if (await btnSolicitar.count() > 0) {
    console.log('Href / tag:', await btnSolicitar.first().getAttribute('href'));
    await btnSolicitar.first().click();
    await page.waitForTimeout(3000);
    console.log('URL após clicar Solicitar:', page.url());
  }

  await page.screenshot({ path: 'qa/screenshots/pos-solicitar.png' });

  await browser.close();
})();
