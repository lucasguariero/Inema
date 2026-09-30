const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental/dae?certidao=1', { waitUntil: 'networkidle' });
  const text1 = await page.innerText('body');
  console.log('Certidão 1:\n', text1.replace(/\n+/g, ' | '));

  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental/dae?certidao=10', { waitUntil: 'networkidle' });
  const text10 = await page.innerText('body');
  console.log('\nCertidão 10:\n', text10.replace(/\n+/g, ' | '));

  await browser.close();
})();
