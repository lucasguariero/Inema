const { test } = require('@playwright/test');

test('inspect table header buttons', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const headerBtns = await page.$$eval('.fi-ta-header-toolbar button, .fi-ta-toolbar button, button', els => els.map(e => ({
    tag: e.tagName,
    text: e.innerText.trim(),
    className: e.className,
    ariaLabel: e.getAttribute('aria-label'),
    title: e.getAttribute('title')
  })));
  console.log('ALL BUTTONS:', headerBtns.filter(b => b.ariaLabel || b.text || b.title));
});
