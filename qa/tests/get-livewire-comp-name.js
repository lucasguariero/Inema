const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao?step=form.questionario%3A%3Adata%3A%3Awizard-step', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const compInfo = await page.evaluate(() => {
    const el = document.querySelector('[wire\\:id]');
    const all = Array.from(document.querySelectorAll('[wire\\:snapshot]'));
    return all.map(c => {
      const snap = JSON.parse(c.getAttribute('wire:snapshot'));
      return {
        name: snap.memo ? snap.memo.name : null,
        id: snap.memo ? snap.memo.id : null,
        dataKeys: snap.data ? Object.keys(snap.data) : []
      };
    });
  });

  console.log('Livewire Components:\n', JSON.stringify(compInfo, null, 2));

  await browser.close();
})();
