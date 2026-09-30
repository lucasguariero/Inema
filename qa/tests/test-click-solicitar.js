const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type=\"text\"]').first().fill('00000000000');
  await page.locator('input[type=\"password\"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Acessando /atividades-dispensadas/informacoes ---');
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const btnSolicitar = page.getByText('Solicitar ANSLA');
  console.log('Btn Solicitar ANSLA count:', await btnSolicitar.count());
  if (await btnSolicitar.count() > 0) {
    console.log('Clicando em Solicitar ANSLA...');
    await btnSolicitar.first().click();
    await page.waitForTimeout(3000);
    console.log('URL após clique:', page.url());
    console.log('Title após clique:', await page.title());
    const mainText = await page.locator('main').innerText();
    console.log('Main text:\n', mainText.substring(0, 1000));
  }

  await page.screenshot({ path: 'qa/screenshots/solicitar-click.png' });
  await browser.close();
})();
