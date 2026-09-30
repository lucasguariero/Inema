const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type=\"text\"]').first().fill('00000000000');
  await page.locator('input[type=\"password\"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mainHtml = await page.locator('main').innerHTML();
  console.log('MAIN HTML length:', mainHtml.length);
  console.log('MAIN HTML sample:', mainHtml.substring(0, 1000));

  const mainText = await page.locator('main').innerText();
  console.log('MAIN TEXT:', mainText);

  await browser.close();
})();
