const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_ceuc_refino');
  const qaDir = path.join(__dirname, '..', 'qa', 'cards', 'ceuc-refino-cirurgico', 'prints');
  
  for (const d of [screenshotsDir, qaDir]) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  console.log('Iniciando Vite Preview na porta 4177...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4177'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    // Retry connection until server is ready
    let connected = false;
  for (let i = 0; i < 15; i++) {
    try {
      await page.goto('http://localhost:4177/?modulo=ceuc', { waitUntil: 'domcontentloaded', timeout: 5000 });
      connected = true;
      break;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  if (!connected) throw new Error('Não foi possível conectar ao servidor Vite Preview');
  await page.waitForTimeout(1000);

    // 1. Captura Print 01: TL001 com Filtro de Gestor integrado na toolbar
    console.log('Capturando Print 01: TL001 com Filtro de Gestor...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_tl001_filtro_gestor.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 01 - TL001 com Filtro de Gestor Integrado.png'), fullPage: false });

    // 2. Clicar em "+ Nova UC" para abrir a TL002 refinada
    console.log('Clicando em "+ Nova UC"...');
    const btnNovaUc = page.locator('button:has-text("Nova UC")');
    await btnNovaUc.click();
    await page.waitForTimeout(800);

    // Captura Print 02: Cabeçalho com ações diretas, abas limpas e Seção 1
    console.log('Capturando Print 02: TL002 - Cabeçalho com ações e Seção 1...');
    await page.screenshot({ path: path.join(screenshotsDir, '02_tl002_cabecalho_acoes_secao1.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 02 - TL002 Cabecalho com Acoes e Secao 1 Enquadramento SEUC.png'), fullPage: false });

    // 3. Scroll para Seção 2 (População Estimada, Observações / Status Fundiário e Chips)
    console.log('Rolando para Seção 2...');
    await page.evaluate(() => window.scrollBy(0, 480));
    await page.waitForTimeout(600);
    console.log('Capturando Print 03: Seção 2 com População e Status Fundiário...');
    await page.screenshot({ path: path.join(screenshotsDir, '03_tl002_secao2_populacao_fundiario.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 03 - TL002 Secao 2 Populacao Estimada e Status Fundiario.png'), fullPage: false });

    // 4. Voltar à lista e abrir Edição da UC com documento anexado para testar visualizador
    console.log('Retornando à lista para testar visualização de anexo em edição...');
    await page.goto('http://localhost:4177/?modulo=ceuc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const btnEditar = page.locator('button:has-text("Editar")').first();
    await btnEditar.click();
    await page.waitForTimeout(800);

    console.log('Clicando em "Visualizar" no anexo normativo...');
    const btnVisualizarAnexo = page.locator('button:has-text("Visualizar")').first();
    if (await btnVisualizarAnexo.count() > 0) {
      await btnVisualizarAnexo.click();
      await page.waitForTimeout(600);
      console.log('Capturando Print 04: Modal de Visualização de Anexo (RN006)...');
      await page.screenshot({ path: path.join(screenshotsDir, '04_tl002_modal_anexo.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 04 - TL002 Modal de Visualizacao de Documento Normativo.png'), fullPage: false });
    }

    console.log('Todas as capturas do refino cirúrgico foram concluídas com sucesso!');
  } catch (err) {
    console.error('Erro na automação de refino:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
