const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_regulacao_gla');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Acessando página de Relatórios de Regulação...');
    await page.goto('http://localhost:4173/?rota=relatorios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Aba Tramitações no Período - Padrão GLA Legado
    console.log('Capturando Print 01: Tramitações no período (GLA Legado)...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_tramitacoes_gla_legado.png'), fullPage: false });

    // 2. Abrir Drawer de Filtros na Aba 1
    console.log('Abrindo Drawer de Filtros na Aba Tramitações...');
    const btnFiltros = page.locator('button:has-text("Filtros")');
    if (await btnFiltros.count() > 0) {
      await btnFiltros.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '02_drawer_tramitacoes.png'), fullPage: false });
      // Fechar drawer clicando em Consultar
      const btnConsultar = page.locator('button:has-text("Consultar")');
      if (await btnConsultar.count() > 0) {
        await btnConsultar.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    }

    // 3. Modal de Detalhe
    console.log('Abrindo Modal de Detalhe...');
    const btnDetalhar = page.locator('button:has-text("Detalhar")');
    if (await btnDetalhar.count() > 0) {
      await btnDetalhar.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '03_modal_detalhe_gla.png'), fullPage: false });
      const btnFecharModal = page.locator('button:has-text("Fechar")');
      if (await btnFecharModal.count() > 0) {
        await btnFecharModal.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    }

    // 4. Aba Acompanhamento da Pauta - Padrão GLA Legado
    console.log('Acessando Aba Acompanhamento da pauta...');
    const tabPauta = page.locator('button:has-text("Acompanhamento da pauta")');
    await tabPauta.first().click();
    await page.waitForTimeout(800);
    console.log('Capturando Print 04: Acompanhamento da Pauta (GLA Legado)...');
    await page.screenshot({ path: path.join(screenshotsDir, '04_pauta_gla_legado.png'), fullPage: false });

    // 5. Abrir Drawer de Filtros na Aba Pauta
    console.log('Abrindo Drawer de Filtros na Aba Pauta...');
    const btnFiltrosPauta = page.locator('button:has-text("Filtros da Pauta")');
    if (await btnFiltrosPauta.count() > 0) {
      await btnFiltrosPauta.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '05_drawer_pauta.png'), fullPage: false });
      const btnConsultarPauta = page.locator('button:has-text("Consultar")');
      if (await btnConsultarPauta.count() > 0) {
        await btnConsultarPauta.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    }

    // 6. Captura com scroll da tabela na Aba Pauta
    console.log('Capturando Print 06: Tabela da Pauta (Scroll)...');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '06_tabela_pauta_gla.png'), fullPage: false });

    console.log('Todas as capturas foram concluídas com sucesso!');
  } catch (err) {
    console.error('Erro durante a verificação:', err);
  } finally {
    await browser.close();
    server.kill();
    try {
      spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { shell: true });
    } catch (e) {}
  }
}

main();
