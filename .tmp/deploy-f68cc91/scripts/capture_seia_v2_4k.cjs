const http = require('http');
const path = require('path');
const fs = require('fs');
const { chromium } = require('@playwright/test');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function createStaticServer(distDir, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
      let filePath = path.join(distDir, urlPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (e) {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
    server.on('error', reject);
  });
}

async function main() {
  const outputDir = path.resolve(__dirname, '../prints_seia_v2_4k_16x9');
  const distDir = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const PORT = 4188;
  console.log(`Iniciando servidor HTTP interno na porta ${PORT} para a pasta dist...`);
  const server = await createStaticServer(distDir, PORT);
  console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);

  console.log('Iniciando navegador Playwright (viewport 1920x1080 @ 2x -> 3840x2160 4K UHD 16:9)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const baseUrl = `http://127.0.0.1:${PORT}`;

  try {
    // =========================================================================
    // 1. DASHBOARD GERENCIAL MACRO (TELA 1)
    // =========================================================================
    console.log('\n[1/11] Capturando Dashboard Gerencial SEIA V2 em 4K...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '01_seia_v2_dashboard_gerencial_macro.png') });
    console.log('-> Salvo: 01_seia_v2_dashboard_gerencial_macro.png');

    // =========================================================================
    // 2. FORMULÁRIO DE CADASTRO COMPLEXO WIZARD (TELA 2 - 5 ETAPAS)
    // =========================================================================
    console.log('\n[2/11] Capturando Formulário Complexo - Etapa 01 (Identificação & Localização)...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=formulario`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '02_seia_v2_formulario_etapa1_identificacao.png') });
    console.log('-> Salvo: 02_seia_v2_formulario_etapa1_identificacao.png');

    console.log('\n[3/11] Capturando Formulário Complexo - Etapa 02 (Enquadramento da Atividade)...');
    const step2Btn = page.locator('button:has-text("Enquadramento da Atividade")');
    if (await step2Btn.count() > 0) {
      await step2Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 02")');
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '03_seia_v2_formulario_etapa2_enquadramento.png') });
    console.log('-> Salvo: 03_seia_v2_formulario_etapa2_enquadramento.png');

    // Demonstração do Dropdown Customizado Aberto
    console.log('\n[3b/11] Capturando Dropdown Customizado Aberto (CustomSelect)...');
    const customDropdownTrigger = page.locator('button:has-text("Licença de Instalação (LI) com ampliação")');
    if (await customDropdownTrigger.count() > 0) {
      await customDropdownTrigger.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outputDir, '03b_seia_v2_formulario_custom_dropdown_aberto.png') });
      console.log('-> Salvo: 03b_seia_v2_formulario_custom_dropdown_aberto.png');
      await customDropdownTrigger.click(); // fecha
      await page.waitForTimeout(300);
    }

    console.log('\n[4/11] Capturando Formulário Complexo - Etapa 03 (Água & Supressão Vegetal)...');
    const step3Btn = page.locator('button:has-text("Água & Supressão Vegetal")');
    if (await step3Btn.count() > 0) {
      await step3Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 03")');
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '04_seia_v2_formulario_etapa3_agua_supressao.png') });
    console.log('-> Salvo: 04_seia_v2_formulario_etapa3_agua_supressao.png');

    console.log('\n[5/11] Capturando Formulário Complexo - Etapa 04 (Documentos & Responsabilidade)...');
    const step4Btn = page.locator('button:has-text("Documentos & Responsabilidade")');
    if (await step4Btn.count() > 0) {
      await step4Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 04")');
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '05_seia_v2_formulario_etapa4_documentos_filepond.png') });
    console.log('-> Salvo: 05_seia_v2_formulario_etapa4_documentos_filepond.png');

    console.log('\n[6/11] Capturando Formulário Complexo - Etapa 05 (Declarações & Taxas)...');
    const step5Btn = page.locator('button:has-text("Declarações & Taxas")');
    if (await step5Btn.count() > 0) {
      await step5Btn.click();
    } else {
      await page.click('button:has-text("Avançar para Etapa 05")');
    }
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outputDir, '06_seia_v2_formulario_etapa5_declaracoes_taxas.png') });
    console.log('-> Salvo: 06_seia_v2_formulario_etapa5_declaracoes_taxas.png');

    // =========================================================================
    // 3. TABELA OPERACIONAL DE ALTA DENSIDADE (TELA 3)
    // =========================================================================
    console.log('\n[7/11] Capturando Tabela Operacional - Visão Geral com Filtros e SLAs...');
    await page.goto(`${baseUrl}/?rota=seia-v2&tela=tabela`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '07_seia_v2_tabela_operacional_visao_geral.png') });
    console.log('-> Salvo: 07_seia_v2_tabela_operacional_visao_geral.png');

    console.log('\n[8/11] Capturando Tabela Operacional - Filtro Ativo por Status...');
    const statusDropdown = page.locator('button:has-text("Todos os Status")');
    if (await statusDropdown.count() > 0) {
      await statusDropdown.click();
      await page.waitForTimeout(400);
      const optionAnalise = page.locator('button:has-text("Em Análise Técnica")').last();
      if (await optionAnalise.count() > 0) {
        await optionAnalise.click();
        await page.waitForTimeout(600);
      }
      await page.screenshot({ path: path.join(outputDir, '08_seia_v2_tabela_operacional_filtro_status.png') });
      console.log('-> Salvo: 08_seia_v2_tabela_operacional_filtro_status.png');
      
      // Reseta filtro
      const currentDropdown = page.locator('button:has-text("Em Análise Técnica")').first();
      if (await currentDropdown.count() > 0) {
        await currentDropdown.click();
        await page.waitForTimeout(300);
        await page.locator('button:has-text("Todos os Status")').last().click();
        await page.waitForTimeout(300);
      }
    }

    console.log('\n[9/11] Capturando Tabela Operacional - Seleção Múltipla em Lote...');
    const selectAllCheckbox = page.locator('thead input[type="checkbox"]');
    if (await selectAllCheckbox.count() > 0) {
      await selectAllCheckbox.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(outputDir, '09_seia_v2_tabela_operacional_selecao_lote.png') });
      console.log('-> Salvo: 09_seia_v2_tabela_operacional_selecao_lote.png');
    }

    console.log('\n[10/11] Capturando Tabela Operacional - Modal de Detalhes do Processo...');
    const btnVer = page.locator('button[title="Visualizar Detalhes"]').first();
    if (await btnVer.count() > 0) {
      await btnVer.click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(outputDir, '10_seia_v2_tabela_operacional_modal_detalhes.png') });
      console.log('-> Salvo: 10_seia_v2_tabela_operacional_modal_detalhes.png');
    }

    console.log('\n=== TODAS AS 11 CAPTURAS DO SEIA V2 EM 4K 16:9 FORAM GERADAS COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro na automação 4K:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
}

main().catch(console.error);
