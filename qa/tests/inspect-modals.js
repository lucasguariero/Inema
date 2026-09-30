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

  // Acionar tramitar
  await page.evaluate(() => {
    const btn = document.querySelector('button[wire\\:click*="mountAction(\'tramitar\'"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(2500);

  // Listar todas as divs com fi-modal ou dialog
  const modals = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fi-modal, [role="dialog"], [x-ref="modalContainer"] *')).map(el => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
      text: el.innerText.trim(),
      display: window.getComputedStyle(el).display,
      visibility: window.getComputedStyle(el).visibility
    })).filter(m => m.text.length > 0 && !m.text.includes('Sem notificações'));
  });

  console.log('Modals filtrados encontrados:', modals.slice(0, 10));

  await browser.close();
})();
