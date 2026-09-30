const { test, expect } = require('@playwright/test');

test('test setting date via Alpine', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Set date via Alpine
  await page.$eval('#form\\.espl_data_inicio', (el, val) => {
    const alpine = el._x_dataStack[0];
    alpine.state = val;
  }, '2026-09-20');

  await page.$eval('#form\\.espl_data_fim', (el, val) => {
    const alpine = el._x_dataStack[0];
    alpine.state = val;
  }, '2026-09-08');

  await page.waitForTimeout(1000);

  const valInicio = await page.$eval('#form\\.espl_data_inicio', el => el.value);
  const valFim = await page.$eval('#form\\.espl_data_fim', el => el.value);
  console.log('Valores nos inputs:', { valInicio, valFim });

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-alpine-dates.png' });
});
