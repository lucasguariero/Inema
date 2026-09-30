const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('735.128.460-17');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('Login URL:', page.url());
  const errorMsg = await page.locator('.fi-fo-field-wrp-error-message, [role="alert"]').allInnerTexts().catch(() => []);
  console.log('Error messages:', errorMsg);

  if (!page.url().includes('login')) {
    await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('Linhas Pauta da Área:', await page.locator('table tbody tr').count());
  }

  await browser.close();
})();
