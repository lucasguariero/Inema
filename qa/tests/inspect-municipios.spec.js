const { test } = require('@playwright/test');

test('inspect municipios dropdown', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on municipios button
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-municipios-aberto.png' });

  // Dump visible options
  const visibleOptions = await page.$$eval('[role="option"], .fi-select-input-option, li, div[wire\\:key]', els => 
    els.filter(e => e.offsetParent !== null && e.innerText.trim().length > 0).map(e => ({
      tag: e.tagName,
      text: e.innerText.trim().substring(0, 50),
      className: e.className,
      role: e.getAttribute('role')
    }))
  );
  console.log('Visible dropdown elements:', JSON.stringify(visibleOptions.slice(0, 15), null, 2));
});
