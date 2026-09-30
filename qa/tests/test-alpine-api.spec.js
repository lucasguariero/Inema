const { test } = require('@playwright/test');

test('test Alpine.$data', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const res = await page.evaluate(() => {
    const el = document.getElementById('form.espl_data_inicio');
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) {
      data.state = '2026-09-20';
      return { success: true, displayText: data.displayText, state: data.state };
    }
    return { success: false };
  });
  console.log('RESULTADO ALPINE:', res);

  await page.waitForTimeout(1000);
  const inputVal = await page.$eval('#form\\.espl_data_inicio', el => el.value);
  console.log('Valor no DOM do input:', inputVal);
});
