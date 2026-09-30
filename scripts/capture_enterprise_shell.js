const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Visão Geral Enterprise Shell (1920x1080)
  await page.screenshot({
    path: path.resolve(brainDir, '30-enterprise-shell-overview.png'),
    fullPage: false
  });
  console.log('Screenshot 30 (Enterprise Shell Overview) salvo.');

  // 2. Detalhe Topbar + Brand Header
  await page.screenshot({
    path: path.resolve(brainDir, '31-topbar-breadcrumb-brand.png'),
    clip: { x: 0, y: 0, width: 1920, height: 120 }
  });
  console.log('Screenshot 31 (Topbar Breadcrumb Brand) salvo.');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
