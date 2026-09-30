const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Acessando SPA em http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Check if image loaded and has dimensions
  const logoInfo = await page.evaluate(() => {
    const img = document.querySelector('header img');
    return {
      src: img ? img.src : null,
      naturalWidth: img ? img.naturalWidth : 0,
      naturalHeight: img ? img.naturalHeight : 0,
      clientWidth: img ? img.clientWidth : 0,
      clientHeight: img ? img.clientHeight : 0,
      complete: img ? img.complete : false
    };
  });

  console.log('Logo info:', logoInfo);

  // Capture Header screenshot
  const headerDest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/14-header-logo.png');
  await page.screenshot({
    path: headerDest,
    clip: { x: 0, y: 0, width: 600, height: 80 }
  });

  // Also full page dashboard
  const fullDest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/09-spa-dashboard.png');
  await page.screenshot({ path: fullDest, fullPage: true });

  console.log('Screenshots capturados com sucesso.');
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
