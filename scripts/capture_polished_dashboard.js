const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Acessando SPA em http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // 1. Screenshot focusing on Toolbar + breathing room (mb-6) + Alert Banner + KPIs
  const toolbarDest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/15-toolbar-spacing.png');
  await page.screenshot({
    path: toolbarDest,
    clip: { x: 280, y: 60, width: 1640, height: 450 }
  });
  console.log('Screenshot 15 (Toolbar spacing) capturado.');

  // 2. Screenshot focusing on Recharts cards (high contrast text and legends)
  const chartsDest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/16-charts-contrast.png');
  await page.screenshot({
    path: chartsDest,
    clip: { x: 280, y: 480, width: 1640, height: 580 }
  });
  console.log('Screenshot 16 (Charts contrast) capturado.');

  // 3. Full dashboard
  const fullDest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/09-spa-dashboard.png');
  await page.screenshot({ path: fullDest, fullPage: true });
  console.log('Screenshot 09 (Full dashboard) atualizado.');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
