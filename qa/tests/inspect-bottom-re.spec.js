const { test } = require('@playwright/test');

test('inspect informacoes adicionais on RE aberto', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia?emergencia=20', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-bottom-re-aberto.png' });

  const textareas = await page.$$eval('textarea, button', els => els.map(e => ({
    tag: e.tagName,
    id: e.id,
    placeholder: e.placeholder,
    text: e.innerText ? e.innerText.trim() : null,
    disabled: e.disabled
  })));
  console.log('BOTTOM ELEMENTS:', textareas.filter(t => t.placeholder || t.text));
});
