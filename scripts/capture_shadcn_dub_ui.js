const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  // 1. Header institucional limpo
  await page.screenshot({
    path: path.resolve(brainDir, '21-header-shadcn.png'),
    clip: { x: 0, y: 0, width: 1920, height: 70 }
  });
  console.log('Screenshot 21 (Header shadcn) salvo.');

  // 2. Topo da página + Page Header + Controls únicos + Grid de KPIs
  await page.screenshot({
    path: path.resolve(brainDir, '22-page-header-and-kpis.png'),
    clip: { x: 280, y: 60, width: 1640, height: 360 }
  });
  console.log('Screenshot 22 (Page Header e KPIs Dub.co) salvo.');

  // 3. Distribuição Analítica de 3 colunas (Entrada vs Saida, Status Dub.co, Unidade)
  await page.screenshot({
    path: path.resolve(brainDir, '23-analytics-3cols-dub.png'),
    clip: { x: 280, y: 360, width: 1640, height: 420 }
  });
  console.log('Screenshot 23 (3 Colunas Analíticas Dub.co) salvo.');

  // 4. Pauta Crítica (Tabela densa + paginação)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.resolve(brainDir, '24-table-dense-pagination.png'),
    clip: { x: 280, y: 440, width: 1640, height: 600 }
  });
  console.log('Screenshot 24 (Tabela Densa com Paginação) salvo.');

  // 5. Visão Completa da Página (Full Page)
  await page.screenshot({
    path: path.resolve(brainDir, '25-full-dashboard-shadcn-dub.png'),
    fullPage: true
  });
  console.log('Screenshot 25 (Dashboard Completo shadcn + Dub.co) salvo.');

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
