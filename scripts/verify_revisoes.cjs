const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_revisoes_finais');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4174'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. DOR004 (Pesquisa Científica) - Sem padding duplo
    console.log('Verificando DOR004...');
    await page.goto('http://localhost:4174/?rota=uc-pesquisa-cientifica', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '01_dor004_sem_padding_duplo.png') });

    // 2. Consulta Cidadão (Consulta Externa) - 100% largura fluida
    console.log('Verificando Consulta Cidadão...');
    await page.goto('http://localhost:4174/?rota=consulta-externa', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '02_consulta_cidadao_fluida.png') });

    // 3. Painel Interno DIFIS (Consulta Interna) - 100% largura fluida
    console.log('Verificando Consulta Interna...');
    await page.goto('http://localhost:4174/?rota=consulta-interna', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '03_consulta_interna_fluida.png') });

    // 4. Relatórios de Regulação - Aba Tramitações (Filtros leves + Exportar no CardHeader + Tabela DOR003/002)
    console.log('Verificando Relatórios - Tramitações...');
    await page.goto('http://localhost:4174/?rota=relatorios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04_relatorios_tramitacoes_tabela.png') });

    // 5. Relatórios de Regulação - Aba Acompanhamento da Pauta
    console.log('Verificando Relatórios - Pauta...');
    const tabPauta = page.locator('button:has-text("Acompanhamento da pauta")');
    await tabPauta.first().click();
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '05_relatorios_pauta_tabela.png') });

    console.log('Todas as telas foram verificadas e fotografadas com sucesso!');
  } catch (err) {
    console.error('Erro na verificação:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
