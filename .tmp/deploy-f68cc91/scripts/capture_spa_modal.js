const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  console.log('Acessando SPA em http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Clica na primeira linha da tabela para abrir o modal de detalhes
  console.log('Clicando na linha do processo prioritário...');
  const firstRow = page.locator('tbody tr').first();
  await firstRow.click();
  await page.waitForTimeout(600);

  const dest = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/10-spa-modal.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log(`Screenshot do modal salvo com sucesso em: ${dest}`);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
