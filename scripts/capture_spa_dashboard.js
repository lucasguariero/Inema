const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Acessa o build do SPA via preview local
  console.log('Acessando SPA em http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const dest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/09-spa-dashboard.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log(`Screenshot salvo com sucesso em: ${dest}`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
