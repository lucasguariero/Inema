const { test } = require('@playwright/test');

test('dump datepicker element HTML', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const containerHTML = await page.$eval('#form\\.espl_data_inicio', el => el.closest('.fi-fo-date-time-picker') ? el.closest('.fi-fo-date-time-picker').outerHTML : el.parentElement.parentElement.outerHTML);
  console.log('DATE PICKER CONTAINER HTML:');
  console.log(containerHTML);
});
