const { test } = require('@playwright/test');

test('dump input attributes', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const inputHTML = await page.$eval('#form\\.espl_data_inicio', el => el.outerHTML);
  console.log('INPUT HTML:', inputHTML);

  // Check how Alpine component handles state
  const alpineData = await page.$eval('#form\\.espl_data_inicio', el => {
    const alpineEl = el.closest('[x-data]');
    return alpineEl ? alpineEl.getAttribute('x-data') : null;
  });
  console.log('ALPINE X-DATA:', alpineData);
});
