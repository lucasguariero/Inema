const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Sidebar view (showing entire height down to bottom, without AI card and with clean breathing room)
  await page.screenshot({
    path: path.resolve(brainDir, '17-sidebar-clean.png'),
    clip: { x: 0, y: 56, width: 280, height: 1024 }
  });

  // 2. Middle charts row (Entrada vs Saida, Status Donut, Unidade)
  await page.screenshot({
    path: path.resolve(brainDir, '18-middle-charts-resized.png'),
    clip: { x: 280, y: 390, width: 1640, height: 430 }
  });

  // 3. Bottom of page (scrolled to bottom to prove pb-16 breathing room)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve(brainDir, '19-page-bottom-spacing.png'),
    clip: { x: 280, y: 400, width: 1640, height: 680 }
  });

  // 4. Full dashboard overview
  await page.screenshot({
    path: path.resolve(brainDir, '20-dashboard-clean-full.png'),
    fullPage: true
  });

  await browser.close();
  console.log('Novos screenshots capturados com sucesso!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
