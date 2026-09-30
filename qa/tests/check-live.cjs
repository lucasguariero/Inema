const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://inema.acto.com.br/?analista=maria', { waitUntil: 'networkidle' });
  const sidebarNav = await page.locator('aside nav').innerText();
  console.log('--- Sidebar Nav Content on Live ---');
  console.log(sidebarNav);
  await browser.close();
})();
