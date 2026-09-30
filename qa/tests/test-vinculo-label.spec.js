const { test } = require('@playwright/test');

test('test vinculo selection and fields', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on "Não" label
  const labelNao = page.locator('label:has-text("Não")').first();
  await labelNao.scrollIntoViewIfNeeded();
  await labelNao.click();
  await page.waitForTimeout(1000);

  const textareaEmpresa = page.locator('textarea[placeholder*="empresa"], textarea#form\\.empresa_nome').first();
  console.log('Textarea empresa visível?', await textareaEmpresa.isVisible());
  if (await textareaEmpresa.isVisible()) {
    await textareaEmpresa.fill('Transportadora Transquímica Nordeste LTDA');
  }

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-vinculo-click-label.png' });
});
