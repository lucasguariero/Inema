const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Look for any links/buttons on this page
  const clickable = await page.locator('main a, main button, #fi-main-content a, #fi-main-content button, a:visible, button:visible').all();
  console.log('Visible elements in page:');
  for (const el of clickable) {
    const text = (await el.innerText()).trim().replace(/\n/g, ' ');
    const tag = await el.evaluate(e => e.tagName);
    const href = await el.getAttribute('href');
    if (text && text.length < 50) {
      console.log([]  );
    }
  }

  // Also check form fields, selects, etc.
  const selects = await page.locator('select, [role=\"combobox\"]').all();
  console.log('\nSelects count:', selects.length);

  await browser.close();
})();
