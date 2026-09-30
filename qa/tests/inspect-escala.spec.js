const { test } = require('@playwright/test');

test('inspect escala form inputs', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const inputs = await page.$$eval('input', els => els.map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    placeholder: e.placeholder,
    ariaLabel: e.getAttribute('aria-label')
  })));
  console.log('INPUTS ENCONTRADOS:', JSON.stringify(inputs, null, 2));

  const buttons = await page.$$eval('button', els => els.map(e => ({
    id: e.id,
    text: e.innerText.trim(),
    role: e.getAttribute('role'),
    ariaLabel: e.getAttribute('aria-label')
  })));
  console.log('BUTTONS ENCONTRADOS:', JSON.stringify(buttons, null, 2));
});
