const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  
  const inputCpf = page.locator('input[type="text"]').first();
  const inputSenha = page.locator('input[type="password"]').first();
  
  await inputCpf.fill('12345678901');
  await inputSenha.fill('@Callcenter123');
  await page.screenshot({ path: 'qa/screenshots/debug-before-submit.png' });
  
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'qa/screenshots/debug-after-submit.png' });
  console.log('Final URL:', page.url());
  
  const errors = await page.locator('.fi-fo-field-wrp-error-message, .text-danger-600, .fi-alert, [role="alert"]').allInnerTexts();
  console.log('Errors:', errors);

  await browser.close();
})();
