const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const row = page.locator('table tbody tr').first();
  const btns = await row.evaluate(el => {
    return Array.from(el.querySelectorAll('button, a')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim(),
      wireClick: b.getAttribute('wire:click'),
      xOnMouseDown: b.getAttribute('x-on:mousedown'),
      xOnClick: b.getAttribute('x-on:click'),
      href: b.getAttribute('href'),
      title: b.getAttribute('title')
    }));
  });
  console.log('Botões na linha:\n', JSON.stringify(btns, null, 2));

  // Verificar se há dropdown ou menu de ações
  const dropdownTrigger = row.locator('button[title*="Outros"], button:has-text("Outros"), button.fi-icon-btn');
  console.log('Trigger dropdown count:', await dropdownTrigger.count());

  await browser.close();
})();
