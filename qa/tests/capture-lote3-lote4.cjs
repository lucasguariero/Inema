const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

function startServer() {
  const distDir = path.resolve(__dirname, '../../dist');
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.json': 'application/json',
  };

  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';
    let filePath = path.join(distDir, reqUrl);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (e) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(4199, () => {
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const lote3Dir = path.resolve(__dirname, '../../Lote_3_Paineis_e_Filtros');
  const lote4Dir = path.resolve(__dirname, '../../Lote_4_Interacoes_e_Estados');
  fs.mkdirSync(lote3Dir, { recursive: true });
  fs.mkdirSync(lote4Dir, { recursive: true });

  const baseUrl = 'http://localhost:4199/?analista=maria';

  try {
    console.log('1. Acessando Aba 2 e abrindo Drawer de Filtros da Pauta...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.click('button:has-text("Acompanhamento da pauta")');
    await page.waitForTimeout(600);
    await page.click('button:has-text("Filtros da Pauta")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(lote3Dir, 'Painel_Filtros_Aba_2_Pauta.png')
    });
    console.log('Salvo: Painel_Filtros_Aba_2_Pauta.png');

    await page.click('button:has-text("Consultar")');
    await page.waitForTimeout(500);

    console.log('2. Testando Estados do Botão Exportar Excel na Pauta...');
    const exportBtnPauta = page.locator('button:has-text("Exportar Excel")');
    await exportBtnPauta.click();
    await page.waitForTimeout(200); // no meio do processamento
    await page.screenshot({
      path: path.join(lote4Dir, 'Botao_Exportar_Excel_Processando.png')
    });
    console.log('Salvo: Botao_Exportar_Excel_Processando.png');

    await page.waitForTimeout(1400); // estado sucesso
    await page.screenshot({
      path: path.join(lote4Dir, 'Botao_Exportar_Excel_Concluido.png')
    });
    console.log('Salvo: Botao_Exportar_Excel_Concluido.png');

    console.log('3. Voltando para Aba 1 e abrindo Dropdown de Seleção (Anual DIRRE)...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('button:has-text("Tramitações no período")');
    await page.waitForTimeout(600);
    await page.click('button:has-text("Anual DIRRE")');
    await page.waitForTimeout(600);

    // Focar e abrir dropdown de Família do ato
    const familiaSelect = page.locator('select').nth(1);
    await familiaSelect.focus();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(lote4Dir, 'Dropdown_Select_Estilizado_CSS.png')
    });
    console.log('Salvo: Dropdown_Select_Estilizado_CSS.png');

    console.log('4. Testando Estado de Nenhum Resultado Encontrado...');
    await page.click('button:has-text("Registros")');
    await page.waitForTimeout(400);
    await page.click('button:has-text("Filtros")');
    await page.waitForTimeout(600);
    await page.fill('input[placeholder*="2026.000"]', 'PROCESSO_INEXISTENTE_999999');
    await page.click('button:has-text("Consultar")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(lote4Dir, 'Estado_Tabela_Nenhum_Resultado.png')
    });
    console.log('Salvo: Estado_Tabela_Nenhum_Resultado.png');

  } catch (err) {
    console.error('Erro na captura:', err);
  } finally {
    await browser.close();
    server.close();
  }
})();
