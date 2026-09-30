const { test } = require('@playwright/test');

test('test search Salvador in municipios', async ({ page }) => {
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

  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-search-salvador-visible.png' });

  // Check what appeared
  const texts = await page.$$eval('[role="option"], .fi-select-input-option, li, div', els => 
    els.filter(e => e.offsetParent !== null && e.innerText && e.innerText.trim() === 'Salvador').map(e => ({
      tag: e.tagName,
      className: e.className,
      role: e.getAttribute('role')
    }))
  );
  console.log('Salvador matches:', JSON.stringify(texts, null, 2));
});
