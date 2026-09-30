const { test } = require('@playwright/test');

test('inspect Nova Emergencia Interna as Gestor', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para Nova Emergência
  await page.goto('https://gla-inema-hml.acto.com.br/emergencias/create', { waitUntil: 'networkidle' }).catch(async () => {
    await page.locator('text=Fiscalização').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Nova Emergência').first().click();
  });
  await page.waitForTimeout(2500);

  console.log('Current URL:', page.url());
  const headerText = await page.locator('h1, h2, .fi-header-heading, .fi-header').allInnerTexts();
  console.log('HEADER TEXTS:', headerText);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-nova-emergencia-gestor.png' });
});
