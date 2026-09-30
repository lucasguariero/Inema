const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  console.log('Navegando em modo mobile (390x844)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Mobile Topbar + Content
  await page.screenshot({
    path: path.resolve(brainDir, '32-mobile-shell-closed.png')
  });
  console.log('Screenshot 32 (Mobile Shell Closed) salvo.');

  // 2. Open Sidebar Drawer
  const hamburger = await page.$('button[aria-label="Abrir menu lateral"]');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.resolve(brainDir, '33-mobile-shell-open.png')
    });
    console.log('Screenshot 33 (Mobile Shell Open) salvo.');
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
