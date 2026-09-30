const { test } = require('@playwright/test');

test('inspect Nova Emergencia fields and test F5 RE increment', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Capture Print 07 - Número inicial
  const reText1 = await page.locator('.fi-header-heading, h2, h3, div:has-text("INEMA/RE")').filter({ hasText: /INEMA\/RE/ }).first().innerText();
  console.log('RE Inicial:', reText1);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 07 - Numero RE gerado antes de preencher.png' });

  // F5 na página
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const reText2 = await page.locator('.fi-header-heading, h2, h3, div:has-text("INEMA/RE")').filter({ hasText: /INEMA\/RE/ }).first().innerText();
  console.log('RE Após F5:', reText2);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 08 - F5 gera novo numero RE sequencial.png' });

  // Inspecionar todos os inputs, selects e botões
  const formElements = await page.$$eval('input, select, textarea, button[role="combobox"], button[type="submit"], button', els => els.map(e => ({
    tag: e.tagName,
    id: e.id,
    name: e.name,
    type: e.type,
    placeholder: e.placeholder,
    text: e.innerText ? e.innerText.trim().substring(0, 30) : null,
    ariaLabel: e.getAttribute('aria-label')
  })));
  console.log('FORM ELEMENTS:', JSON.stringify(formElements.filter(f => f.id || f.placeholder || f.name), null, 2));
});
