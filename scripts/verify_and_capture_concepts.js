const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1536, height: 960 } });
  const page = await context.newPage();

  const outDir = path.resolve('qa/referencias-visuais');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('1. Testando Default Layout (Base)...');
  await page.goto('http://localhost:4173/?tema=padrao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'view-00-default.png') });
  console.log('Screenshot view-00-default.png salvo.');

  console.log('2. Testando Caminho 01: Nordic Climate Tech...');
  await page.goto('http://localhost:4173/?tema=nordic', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'view-01-nordic.png') });
  console.log('Screenshot view-01-nordic.png salvo.');

  console.log('3. Testando Caminho 02: Institutional Deep Forest...');
  await page.goto('http://localhost:4173/?tema=forest', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'view-02-deep-forest.png') });
  console.log('Screenshot view-02-deep-forest.png salvo.');

  console.log('4. Testando Caminho 03: Biophilic Mineral Tech...');
  await page.goto('http://localhost:4173/?tema=biophilic', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'view-03-biophilic-mineral.png') });
  console.log('Screenshot view-03-biophilic-mineral.png salvo.');

  console.log('5. Testando Alternância Interativa via ThemeSwitcher (clique SPA)...');
  await page.click('a[href="/conceito-01"]');
  await page.waitForTimeout(400);
  const isNordicBadgeVisible = await page.getByText('Caminho 01: Nordic Climate Tech').isVisible();
  console.log('Badge Nordic visível após clique:', isNordicBadgeVisible);

  await page.click('a[href="/conceito-02"]');
  await page.waitForTimeout(400);
  const isForestBadgeVisible = await page.getByText('Caminho 02: Institutional Deep Forest').isVisible();
  console.log('Badge Forest visível após clique:', isForestBadgeVisible);

  await page.click('a[href="/conceito-03"]');
  await page.waitForTimeout(400);
  const isMineralBadgeVisible = await page.getByText('Caminho 03: Biophilic Mineral Tech').isVisible();
  console.log('Badge Mineral visível após clique:', isMineralBadgeVisible);

  console.log('6. Testando Layout Legado (/relatorios-antigo.html)...');
  await page.goto('http://localhost:4173/relatorios-antigo.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'view-04-legacy.png') });
  console.log('Screenshot view-04-legacy.png salvo.');

  await browser.close();
  console.log('Todos os testes e capturas concluídos com sucesso!');
})();
