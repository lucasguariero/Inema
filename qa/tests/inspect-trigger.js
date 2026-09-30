const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar o trigger e a estrutura do dropdown
  const triggerInfo = await page.evaluate(() => {
    const row = document.querySelector('table tbody tr');
    const lastTd = row.querySelector('td:last-child');
    const trigger = lastTd.querySelector('[x-ref="trigger"]') || lastTd.querySelector('.fi-dropdown-trigger') || lastTd.querySelector('button');
    return {
      triggerTag: trigger ? trigger.tagName : null,
      triggerClass: trigger ? trigger.className : null,
      triggerHtml: trigger ? trigger.outerHTML : null,
      buttonsInTd: Array.from(lastTd.querySelectorAll('button, a')).map(b => ({
        tag: b.tagName,
        text: b.innerText.trim(),
        class: b.className,
        wireClick: b.getAttribute('wire:click'),
        visible: b.offsetParent !== null
      }))
    };
  });
  console.log('Trigger info:\n', JSON.stringify(triggerInfo, null, 2));

  await browser.close();
})();
