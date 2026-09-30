const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const row = page.locator('table tbody tr').filter({ hasText: '2026.000009' });
  console.log('Linha 2026.000009 count:', await row.count());
  const btns = await row.evaluate(el => {
    return Array.from(el.querySelectorAll('button, a')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim(),
      href: b.getAttribute('href'),
      wireClick: b.getAttribute('wire:click'),
      title: b.getAttribute('title')
    }));
  });
  console.log('Botões no processo 2026.000009:\n', JSON.stringify(btns, null, 2));

  // Clicar no link do processo se houver
  const link = row.locator('a').first();
  if (await link.count() > 0) {
    console.log('Clicando no link do processo...');
    await link.click();
    await page.waitForTimeout(2000);
    console.log('URL após clicar:', page.url());
    console.log('Conteúdo da tela:\n', (await page.innerText('body')).substring(0, 800).replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
