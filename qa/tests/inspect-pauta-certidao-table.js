const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar o snapshot do componente da tabela
  const snaps = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[wire\\:snapshot]')).map(c => {
      try {
        const s = JSON.parse(c.getAttribute('wire:snapshot'));
        return {
          name: s.memo ? s.memo.name : null,
          data: s.data
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
  });

  console.log('Snapshots em /pauta-certidao-debito:\n', JSON.stringify(snaps, null, 2));

  await browser.close();
})();
