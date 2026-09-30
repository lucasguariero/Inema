const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Acessando SPA em http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // 1. Scroll sidebar down to capture lower groups
  const sidebarNav = page.locator('aside nav');
  await sidebarNav.evaluate((el) => {
    el.scrollTop = 500;
  });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/11-sidebar-scrolled.png'),
    clip: { x: 0, y: 0, width: 320, height: 1080 }
  });
  console.log('Screenshot 11 (scrolled) capturado.');

  // 2. Test search filter: type "fauna"
  const searchInput = page.locator('aside input[placeholder*="Filtrar"]');
  await searchInput.fill('fauna');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/12-sidebar-filter-fauna.png'),
    clip: { x: 0, y: 0, width: 320, height: 1080 }
  });
  console.log('Screenshot 12 (filter fauna) capturado.');

  // 3. Test search filter: type "segurança"
  await searchInput.fill('segurança');
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/13-sidebar-filter-seguranca.png'),
    clip: { x: 0, y: 0, width: 320, height: 1080 }
  });
  console.log('Screenshot 13 (filter seguranca) capturado.');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
