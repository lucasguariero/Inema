const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple static server for dist
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

async function runVerification() {
  const server = await startServer();
  console.log('Static test server started on port 4199');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const printsDir = path.resolve(__dirname, '../cards/relatorios-regulacao-naiane/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  try {
    // 1. Visão Isolada da Naiane: ?escopo=regulacao
    console.log('Navigating to scoped view: http://localhost:4199/?escopo=regulacao');
    await page.goto('http://localhost:4199/?escopo=regulacao', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Salvar print da visualização inicial isolada
    await page.screenshot({ path: path.join(printsDir, 'Print 01 - Visualizacao Isolada Naiane e Metricas.png') });
    console.log('Saved: Print 01 - Visualizacao Isolada Naiane e Metricas.png');

    // 2. Abrir "Sobre os dados"
    console.log('Opening "Sobre os dados"...');
    await page.click('button:has-text("Sobre os dados")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, 'Print 02 - Painel Sobre os Dados SEIA.png') });
    console.log('Saved: Print 02 - Painel Sobre os Dados SEIA.png');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // 3. Abrir Detalhar Nível 1 (Painel Lateral de Resumo)
    console.log('Opening Level 1 Detalhar...');
    const detalharBtn = page.locator('button:has-text("Detalhar")').first();
    await detalharBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(printsDir, 'Print 03 - Nivel 1 Painel Lateral de Resumo.png') });
    console.log('Saved: Print 03 - Nivel 1 Painel Lateral de Resumo.png');

    // 4. Clicar em "Ver detalhes completos" (Nível 2)
    console.log('Opening Level 2 Detalhes Completos...');
    await page.click('button:has-text("Ver detalhes completos")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(printsDir, 'Print 04 - Nivel 2 Tela de Detalhes Completos 7 Blocos.png') });
    console.log('Saved: Print 04 - Nivel 2 Tela de Detalhes Completos 7 Blocos.png');
    await page.click('button:has-text("Concluir")');
    await page.waitForTimeout(500);

    // 5. Visualização Atividades por Técnico com Médias NOUT
    console.log('Switching to "Atividades por técnico"...');
    await page.click('button:has-text("Atividades por técnico")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, 'Print 05 - Atividades por Tecnico e Medias NOUT.png') });
    console.log('Saved: Print 05 - Atividades por Tecnico e Medias NOUT.png');

    // 6. Testar Simulação de Média Indisponível
    await page.click('button:has-text("Testar: Cobertura não confirmada")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(printsDir, 'Print 06 - Estado Media Indisponivel NOUT.png') });
    console.log('Saved: Print 06 - Estado Media Indisponivel NOUT.png');

    // 7. Visualização Por Agrupamento
    console.log('Switching to "Por agrupamento"...');
    await page.click('button:has-text("Por agrupamento")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, 'Print 07 - Visao Por Agrupamento e Nota Distintos.png') });
    console.log('Saved: Print 07 - Visao Por Agrupamento e Nota Distintos.png');

    // 8. Visualização Anual DIRRE
    console.log('Switching to "Anual DIRRE"...');
    await page.click('button:has-text("Anual DIRRE")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, 'Print 08 - Visao Anual DIRRE e Avisos Institucionais.png') });
    console.log('Saved: Print 08 - Visao Anual DIRRE e Avisos Institucionais.png');

    // 9. Alternar para Aba 2: Acompanhamento da Pauta
    console.log('Switching to Tab 2: Acompanhamento da pauta...');
    await page.click('button:has-text("Acompanhamento da pauta")');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(printsDir, 'Print 09 - Acompanhamento da Pauta e Casos de Contraste.png') });
    console.log('Saved: Print 09 - Acompanhamento da Pauta e Casos de Contraste.png');

    // 10. Master Portal sem escopo (Todos os módulos visíveis)
    console.log('Navigating to master portal: http://localhost:4199/');
    await page.goto('http://localhost:4199/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(printsDir, 'Print 10 - Portal Master Consolidado Todos os Modulos.png') });
    console.log('Saved: Print 10 - Portal Master Consolidado Todos os Modulos.png');

    console.log('ALL PLAYWRIGHT VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runVerification();
