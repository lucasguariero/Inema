const { test } = require('@playwright/test');

test('inspect existing escalas', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const rows = await page.$$eval('table tbody tr', trs => trs.map(tr => tr.innerText.trim().replace(/\t+/g, ' | ')));
  console.log('EXISTING ESCALAS:');
  console.log(rows);
});
