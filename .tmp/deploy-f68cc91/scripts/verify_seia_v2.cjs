const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_seia_v2');
  const qaDir = path.join(__dirname, '..', 'qa', 'cards', 'seia-v2', 'prints');

  for (const d of [screenshotsDir, qaDir]) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  console.log('Iniciando Vite Preview na porta 4180...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4180'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3500));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  page.on('console', (msg) => console.log('[Browser Console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]', err.message));

  try {
    // 1. Dashboard Gerencial
    console.log('1. Acessando Dashboard Gerencial SEIA V2...');
    await page.goto('http://localhost:4180/?rota=seia-v2&tela=dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '01_seia_v2_dashboard.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 01 - Dashboard Gerencial SEIA V2 Macro Layout.png'), fullPage: false });
    console.log('Salvo: 01_seia_v2_dashboard.png');

    // 2. Formulário Complexo (Wizard Passo 1)
    console.log('2. Acessando Formulário de Cadastro Complexo (Passo 1)...');
    await page.goto('http://localhost:4180/?rota=seia-v2&tela=formulario', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '02_seia_v2_formulario_passo1.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 02 - Formulario Complexo Wizard Passo 1 Requerente.png'), fullPage: false });
    console.log('Salvo: 02_seia_v2_formulario_passo1.png');

    // Avançar para Passo 2 (Empreendimento)
    console.log('Avançando para Passo 2...');
    const btnAvancar = page.locator('button:has-text("Avançar")');
    if (await btnAvancar.count() > 0) {
      await btnAvancar.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '03_seia_v2_formulario_passo2.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 03 - Formulario Complexo Wizard Passo 2 Empreendimento.png'), fullPage: false });
      console.log('Salvo: 03_seia_v2_formulario_passo2.png');
    }

    // 3. Tabela Operacional de Alta Densidade
    console.log('3. Acessando Tabela Operacional SEIA V2...');
    await page.goto('http://localhost:4180/?rota=seia-v2&tela=tabela', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '04_seia_v2_tabela_operacional.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 04 - Tabela Operacional Alta Densidade Filtros e SLAs.png'), fullPage: false });
    console.log('Salvo: 04_seia_v2_tabela_operacional.png');

    // Interação na tabela: selecionar itens em lote
    console.log('Interagindo com seleção em lote...');
    const selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    if (await selectAllCheckbox.count() > 0) {
      await selectAllCheckbox.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(screenshotsDir, '05_seia_v2_tabela_selecao_lote.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 05 - Tabela Selecao em Lote e Barra de Acoes.png'), fullPage: false });
      console.log('Salvo: 05_seia_v2_tabela_selecao_lote.png');
    }

    // 4. Modal / Visualização de Detalhes
    console.log('Visualizando processo...');
    const btnVerPrimeiro = page.locator('button[title="Visualizar Detalhes"]').first();
    if (await btnVerPrimeiro.count() > 0) {
      await btnVerPrimeiro.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(screenshotsDir, '06_seia_v2_tabela_modal_detalhes.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 06 - Modal de Detalhes do Processo SEIA V2.png'), fullPage: false });
      console.log('Salvo: 06_seia_v2_tabela_modal_detalhes.png');
    }

    console.log('\n=== VALIDAÇÃO VISUAL DO SEIA V2 CONCLUÍDA COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro na automação Playwright:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
