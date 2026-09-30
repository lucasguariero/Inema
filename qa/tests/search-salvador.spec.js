const { test } = require('@playwright/test');

test('search salvador', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click on municipios
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(500);

  // Focus and type in the visible search input
  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]').first();
  await searchInput.pressSequentially('Salvador', { delay: 150 });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-search-salvador.png' });

  // Get all text of items in the dropdown
  const listItems = await page.$$eval('[role="listbox"] *, .fi-select-input-options-ctn *', els => 
    els.filter(e => e.innerText && e.innerText.trim().length > 0).map(e => e.innerText.trim())
  );
  console.log('Dropdown items after typing Salvador:', Array.from(new Set(listItems)));
});
