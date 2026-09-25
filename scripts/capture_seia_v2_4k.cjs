const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const outputDir = path.resolve(__dirname, '../prints_seia_v2_4k_16x9');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview na porta 4185...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4185'], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3500));

  console.log('Iniciando navegador Playwright (viewport 1920x1080 @ 2x -> 3840x2160 4K UHD 16:9)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  page.on('console', (msg) => console.log('[Browser Console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]', err.message));

  const baseUrl = 'http://localhost:4185';

  try {
    // =========================================================================
    // 1. DASHBOARD GERENCIAL MACRO (TELA 1)
    // =========================================================================
    console.log('\n[1/10] Capturando Dashboard Gerencial SEIA V2 em 4K...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '01_seia_v2_dashboard_gerencial_macro.png') });
    console.log('-> Salvo: 01_seia_v2_dashboard_gerencial_macro.png');

    // =========================================================================
    // 2. FORMULÁRIO DE CADASTRO COMPLEXO WIZARD (TELA 2 - 5 ETAPAS)
    // =========================================================================
    console.log('\n[2/10] Capturando Formulário Complexo - Etapa 01 (Identificação & Localização)...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=formulario`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '02_seia_v2_formulario_etapa1_identificacao.png') });
    console.log('-> Salvo: 02_seia_v2_formulario_etapa1_identificacao.png');

    console.log('\n[3/10] Capturando Formulário Complexo - Etapa 02 (Enquadramento da Atividade)...');
    const step2Btn = page.locator('button:has-text("Enquadramento da Atividade")');
    if (await step2Btn.count() > 0) {
      await step2Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 02")');
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '03_seia_v2_formulario_etapa2_enquadramento.png') });
    console.log('-> Salvo: 03_seia_v2_formulario_etapa2_enquadramento.png');

    console.log('\n[4/10] Capturando Formulário Complexo - Etapa 03 (Água & Supressão Vegetal)...');
    const step3Btn = page.locator('button:has-text("Água & Supressão Vegetal")');
    if (await step3Btn.count() > 0) {
      await step3Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 03")');
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '04_seia_v2_formulario_etapa3_agua_supressao.png') });
    console.log('-> Salvo: 04_seia_v2_formulario_etapa3_agua_supressao.png');

    console.log('\n[5/10] Capturando Formulário Complexo - Etapa 04 (Documentos & Responsabilidade)...');
    const step4Btn = page.locator('button:has-text("Documentos & Responsabilidade")');
    if (await step4Btn.count() > 0) {
      await step4Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 04")');
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '05_seia_v2_formulario_etapa4_documentos_filepond.png') });
    console.log('-> Salvo: 05_seia_v2_formulario_etapa4_documentos_filepond.png');

    console.log('\n[6/10] Capturando Formulário Complexo - Etapa 05 (Declarações & Taxas)...');
    const step5Btn = page.locator('button:has-text("Declarações & Taxas")');
    if (await step5Btn.count() > 0) {
      await step5Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 05")');
    }
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(outputDir, '06_seia_v2_formulario_etapa5_declaracoes_taxas.png') });
    console.log('-> Salvo: 06_seia_v2_formulario_etapa5_declaracoes_taxas.png');

    // =========================================================================
    // 3. TABELA OPERACIONAL DE ALTA DENSIDADE (TELA 3)
    // =========================================================================
    console.log('\n[7/10] Capturando Tabela Operacional - Visão Geral com Filtros e SLAs...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=tabela`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '07_seia_v2_tabela_operacional_visao_geral.png') });
    console.log('-> Salvo: 07_seia_v2_tabela_operacional_visao_geral.png');

    console.log('\n[8/10] Capturando Tabela Operacional - Filtro Ativo por Status...');
    const selectStatus = page.locator('select').first();
    if (await selectStatus.count() > 0) {
      await selectStatus.selectOption('analise');
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outputDir, '08_seia_v2_tabela_operacional_filtro_status.png') });
      console.log('-> Salvo: 08_seia_v2_tabela_operacional_filtro_status.png');
      // Reseta filtro
      await selectStatus.selectOption('todos');
      await page.waitForTimeout(300);
    }

    console.log('\n[9/10] Capturando Tabela Operacional - Seleção Múltipla em Lote...');
    const selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    if (await selectAllCheckbox.count() > 0) {
      await selectAllCheckbox.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outputDir, '09_seia_v2_tabela_operacional_selecao_lote.png') });
      console.log('-> Salvo: 09_seia_v2_tabela_operacional_selecao_lote.png');
    }

    console.log('\n[10/10] Capturando Tabela Operacional - Modal de Detalhes do Processo...');
    const btnVer = page.locator('button[title="Visualizar Detalhes"]').first();
    if (await btnVer.count() > 0) {
      await btnVer.click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(outputDir, '10_seia_v2_tabela_operacional_modal_detalhes.png') });
      console.log('-> Salvo: 10_seia_v2_tabela_operacional_modal_detalhes.png');
    }

    console.log('\n=== TODAS AS 10 CAPTURAS DO SEIA V2 EM 4K 16:9 FORAM GERADAS COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro na automação 4K:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
