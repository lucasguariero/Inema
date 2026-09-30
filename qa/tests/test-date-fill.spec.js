const { test } = require('@playwright/test');

test('test date fill', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Testing date input fill directly...');
  const inputInicio = page.locator('#form\\.espl_data_inicio');
  console.log('Exists?', await inputInicio.count());
  console.log('Visible?', await inputInicio.isVisible());
  console.log('Enabled?', await inputInicio.isEnabled());

  await inputInicio.click();
  console.log('Clicked!');
  await inputInicio.fill('20/09/2026');
  console.log('Filled! Value is:', await inputInicio.inputValue());

  const inputFim = page.locator('#form\\.espl_data_fim');
  await inputFim.click();
  await inputFim.fill('08/09/2026');
  console.log('Fim filled! Value is:', await inputFim.inputValue());

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-direct-date-fill.png' });
});
