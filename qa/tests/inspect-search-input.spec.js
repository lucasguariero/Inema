const { test } = require('@playwright/test');

test('inspect search input in open municipios', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on municipios button
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(800);

  // Find all inputs on page and their visibility
  const inputsInfo = await page.$$eval('input', els => els.map(e => ({
    id: e.id,
    placeholder: e.placeholder,
    className: e.className,
    visible: e.offsetParent !== null,
    bounding: e.getBoundingClientRect()
  })));
  console.log('INPUTS INFO:', JSON.stringify(inputsInfo, null, 2));
});
