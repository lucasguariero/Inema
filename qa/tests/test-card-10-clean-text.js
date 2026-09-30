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

  const actions = ['tramitar', 'devolver', 'cancelar', 'historico'];
  for (const act of actions) {
    console.log(`\n=== ACTION: ${act} ===`);
    await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate((actionName) => {
      const btn = document.querySelector(`button[wire\\:click*="mountAction('${actionName}'"]`);
      if (btn) btn.click();
    }, act);
    await page.waitForTimeout(2000);

    const modal = page.locator('.fi-modal-window, [role="dialog"]').last();
    const rawText = await modal.innerText().catch(() => '');
    const cleanLines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    console.log(`Linhas do Modal ${act}:`, cleanLines);
  }

  await browser.close();
})();
