const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  await page.locator('text=Registrar Emergência Química').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Simular autenticação' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const datePickerParent = page.locator('.fi-fo-date-time-picker').first();
  const outerHtml = await datePickerParent.evaluate(el => el.outerHTML);
  console.log('Date Picker HTML:');
  console.log(outerHtml);

  await browser.close();
})();
