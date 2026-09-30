const { test } = require('@playwright/test');

test('inspect Gestor sidebar Fiscalizacao', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Click Fiscalização
  const fiscMenu = page.locator('text=Fiscalização').first();
  await fiscMenu.click();
  await page.waitForTimeout(1000);

  const links = await page.$$eval('a', els => els.map(e => ({
    text: e.innerText.trim(),
    href: e.href
  })).filter(l => l.text.length > 0 && l.href.includes('gla-inema')));
  console.log('ALL LINKS:', links);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-gestor-sidebar.png' });
});
