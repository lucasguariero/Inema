const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ver em Financeiro se tem algo de certidão
  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL /certidao-debito-ambiental:', page.url(), 'Title:', await page.title());
  const bodyCertidao = await page.innerText('body');
  console.log('Conteúdo /certidao-debito-ambiental:\n', bodyCertidao.substring(0, 1000).replace(/\n+/g, ' | '));

  await browser.close();
})();
