const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  const tableCard = await page.$('#tabela-prioridades');
  if (tableCard) {
    await tableCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await tableCard.screenshot({
      path: path.resolve(brainDir, '29-table-bleed-and-padding.png')
    });
    console.log('Screenshot 29 (Table Bleed & Padding) salvo.');
  } else {
    console.log('Element #tabela-prioridades não encontrado!');
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
