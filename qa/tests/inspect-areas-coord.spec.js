const { test } = require('@playwright/test');

test('inspect areas and coordenadas HTML', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on "Incluir nova coordenada"
  const btnCoord = page.locator('button:has-text("Incluir nova coordenada")').first();
  await btnCoord.scrollIntoViewIfNeeded();
  await btnCoord.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-coord-aberto.png' });

  const inputs = await page.$$eval('input', els => els.filter(e => e.offsetParent !== null).map(e => ({
    id: e.id,
    name: e.name,
    type: e.type,
    placeholder: e.placeholder,
    value: e.value
  })));
  console.log('VISIBLE INPUTS:', inputs);
});
