const { test } = require('@playwright/test');

test('click Nova Emergencia and inspect page', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Click Fiscalização
  await page.locator('text=Fiscalização').first().click();
  await page.waitForTimeout(800);

  // Click Nova Emergência
  await page.locator('a:has-text("Nova Emergência")').first().click();
  await page.waitForTimeout(3000);

  console.log('Nova Emergência URL:', page.url());
  const heading = await page.locator('h1, h2, .fi-header-heading').allInnerTexts();
  console.log('Heading:', heading);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-form-nova-emergencia.png' });
});
