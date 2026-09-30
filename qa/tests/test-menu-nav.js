const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  console.log('Logging in as Admin...');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
  console.log('Admin URL:', page.url());

  // Collect all menu links
  const links = await page.locator('nav a, aside a, .fi-sidebar-nav a, a').all();
  console.log('Links found:');
  const seen = new Set();
  for (const link of links) {
    const text = (await link.innerText()).trim().replace(/\n/g, ' ');
    const href = await link.getAttribute('href');
    if (href && !seen.has(href)) {
      seen.add(href);
      if (text) console.log(' - ' + text + ' => ' + href);
    }
  }

  await page.screenshot({ path: 'qa/screenshots/admin-dashboard.png' });
  await browser.close();
})();
