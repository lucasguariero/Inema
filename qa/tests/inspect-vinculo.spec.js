const { test } = require('@playwright/test');

test('inspect vinculo Nao', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const radioNao = page.locator('#form\\.ind_vinculo_empresa-0').first();
  await radioNao.scrollIntoViewIfNeeded();
  await radioNao.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-vinculo-nao.png' });

  const inputs = await page.$$eval('.fi-fo-field-wrp input, .fi-fo-field-wrp select', els => els.map(e => ({
    id: e.id,
    placeholder: e.placeholder,
    type: e.type,
    label: e.closest('.fi-fo-field-wrp') ? e.closest('.fi-fo-field-wrp').querySelector('label')?.innerText.trim() : null
  })));
  console.log('INPUTS DEPOIS DE VINCULO NAO:', inputs.filter(i => i.label && i.label.includes('Empresa') || i.label && i.label.includes('empresa')));
});
