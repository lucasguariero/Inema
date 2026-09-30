const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Marca do Header (Canto Superior Esquerdo)
  await page.screenshot({
    path: path.resolve(brainDir, '26-header-brand-polished.png'),
    clip: { x: 0, y: 0, width: 600, height: 60 }
  });
  console.log('Screenshot 26 (Header Brand Polished) salvo.');

  // 2. Card 'Processos por Unidade' (Margem Direita)
  await page.screenshot({
    path: path.resolve(brainDir, '27-unidade-margin-polished.png'),
    clip: { x: 1300, y: 360, width: 580, height: 350 }
  });
  console.log('Screenshot 27 (Unidade Margin Polished) salvo.');

  // 3. Alinhamento da Toolbar da Tabela (Pauta Prioritária)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve(brainDir, '28-table-toolbar-aligned.png'),
    clip: { x: 280, y: 440, width: 1600, height: 500 }
  });
  console.log('Screenshot 28 (Table Toolbar Aligned) salvo.');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
