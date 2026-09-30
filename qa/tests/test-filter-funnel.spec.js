const { test } = require('@playwright/test');

test('test filter vigente em', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click filter button (funnel)
  const filterBtn = page.locator('button:has(svg path[d*="M12 3c-4.97"]), button[aria-label*="Filtro"], .fi-ta-filter-indicators-trigger, button[aria-label*="filtro"]').first();
  console.log('Filter button exists?', await filterBtn.count());
  await filterBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-filtro-aberto.png' });

  // Check inputs in filter popover
  const filterInputs = await page.$$eval('.fi-dropdown-panel input, .fi-ta-filter input', els => els.map(e => ({
    placeholder: e.placeholder,
    className: e.className,
    id: e.id,
    type: e.type
  })));
  console.log('FILTER INPUTS:', filterInputs);
});
