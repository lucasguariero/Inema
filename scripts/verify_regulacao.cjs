const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_regulacao');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  // Aguardar servidor subir
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Acessando página de Relatórios de Regulação...');
    await page.goto('http://localhost:4173/?rota=relatorios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Aba Tramitações - Visão Geral (Modo Registros)
    console.log('Capturando Print 01: Tramitações no período...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_tramitacoes_registros.png'), fullPage: false });

    // 2. Abrir Drawer de Filtros
    console.log('Abrindo Drawer de Filtros...');
    const btnFiltros = page.locator('button:has-text("Filtros")');
    if (await btnFiltros.count() > 0) {
      await btnFiltros.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, '02_drawer_filtros.png'), fullPage: false });
      // Fechar drawer
      const btnFechar = page.locator('button:has-text("Consultar")');
      if (await btnFechar.count() > 0) {
        await btnFechar.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(500);
    }

    // 3. Abrir Modal de Detalhamento
    console.log('Abrindo Modal de Detalhamento...');
    const btnDetalhar = page.locator('button:has-text("Detalhar")');
    if (await btnDetalhar.count() > 0) {
      await btnDetalhar.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '03_modal_detalhe_processo.png'), fullPage: false });
      // Fechar modal
      const btnFecharModal = page.locator('button:has-text("Fechar")');
      if (await btnFecharModal.count() > 0) {
        await btnFecharModal.first().click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(600);
    }

    // 4. Modo Atividades por Técnico
    console.log('Testando Modo B: Atividades por técnico...');
    await page.click('button:has-text("Atividades por técnico")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '04_atividades_tecnico.png'), fullPage: false });

    // 5. Modo Anual DIRRE
    console.log('Testando Modo D: Anual DIRRE...');
    await page.click('button:has-text("Anual DIRRE")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '05_anual_dirre.png'), fullPage: false });

    // 6. Aba Acompanhamento da Pauta
    console.log('Acessando Aba 2: Acompanhamento da Pauta...');
    await page.click('button:has-text("Acompanhamento da pauta")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotsDir, '06_acompanhamento_pauta.png'), fullPage: false });

    console.log('Todas as capturas foram concluídas com sucesso!');
  } catch (err) {
    console.error('Erro durante a verificação:', err);
  } finally {
    await browser.close();
    server.kill();
    // No Windows, garantir encerramento do processo em background
    try {
      spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t'], { shell: true });
    } catch (e) {}
  }
}

main();
