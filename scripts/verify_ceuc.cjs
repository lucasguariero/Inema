const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_ceuc');
  const qaDir = path.join(__dirname, '..', 'qa', 'cards', 'ceuc-fase-1', 'prints');
  
  for (const d of [screenshotsDir, qaDir]) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  console.log('Iniciando Vite Preview na porta 4175...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4175'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('Acessando http://localhost:4175/?modulo=ceuc...');
    await page.goto('http://localhost:4175/?modulo=ceuc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Visão Geral da Listagem TL001
    console.log('Capturando Print 01: Visão Geral TL001 com Sidebar Isolada...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_ceuc_listagem_tl001.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 01 - Visao Geral TL001 Listagem CEUC.png'), fullPage: false });

    // 2. Filtro por Busca Textual
    console.log('Testando busca por "Parque"...');
    const inputBusca = page.locator('input[placeholder*="Buscar por nome"]');
    if (await inputBusca.count() > 0) {
      await inputBusca.fill('Parque');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, '02_ceuc_filtro_busca.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 02 - Filtro por Nome e Categoria.png'), fullPage: false });
      // Limpar busca
      await inputBusca.fill('');
      await page.waitForTimeout(300);
    }

    // 3. Modal de Visualização da UC
    console.log('Abrindo modal de Visualização da UC...');
    const btnVisualizar = page.locator('button:has-text("Visualizar")');
    if (await btnVisualizar.count() > 0) {
      await btnVisualizar.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '03_ceuc_modal_visualizar.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 03 - Modal de Detalhes da UC.png'), fullPage: false });
      
      // Fechar modal
      const btnFechar = page.locator('button:has-text("Fechar")');
      if (await btnFechar.count() > 0) {
        await btnFechar.click();
        await page.waitForTimeout(400);
      }
    }

    // 4. Teste de Exportação com Toast no Canto Superior Direito
    console.log('Testando ação de exportação...');
    const btnExportar = page.locator('button:has-text("Exportar Lista")');
    if (await btnExportar.count() > 0) {
      await btnExportar.click();
      await page.waitForTimeout(1400); // Aguardar spinner terminar e notificação toast aparecer
      await page.screenshot({ path: path.join(screenshotsDir, '04_ceuc_exportar_toast.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 04 - Exportacao com Notificacao Toast.png'), fullPage: false });
    }

    console.log('Capturas concluídas com sucesso!');
  } catch (err) {
    console.error('Erro na automação Playwright:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
