const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/portal/ato-ambiental/ato-ambientals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Atos Ambientais:', page.url(), 'Title:', await page.title());
  const rows = await page.locator('table tbody tr').allInnerTexts().catch(() => []);
  console.log('Total atos cadastrados:', rows.length);
  for (const r of rows.slice(0, 10)) {
    console.log('Ato:', r.replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
