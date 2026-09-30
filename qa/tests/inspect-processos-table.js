const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const ths = await page.locator('table th').allInnerTexts();
  console.log('Colunas /processos:', ths.map(t => t.trim()).filter(Boolean));

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Processos em /processos:\n', rows.map(r => r.replace(/\n+/g, ' | ')).join('\n'));

  // Inspecionar ações no primeiro processo
  const row1 = page.locator('table tbody tr').first();
  const btns = await row1.evaluate(el => {
    return Array.from(el.querySelectorAll('button, a')).map(b => ({
      text: b.innerText.trim(),
      href: b.getAttribute('href'),
      wireClick: b.getAttribute('wire:click')
    }));
  });
  console.log('Ações no processo 1:\n', JSON.stringify(btns, null, 2));

  await browser.close();
})();
