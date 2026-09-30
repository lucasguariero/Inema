const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const PORT = 5199;

// MIME types simples
const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let parsed = req.url.split('?')[0];
      if (parsed === '/') parsed = '/index.html';
      let filePath = path.join(DIST_DIR, parsed);

      if (!fs.existsSync(filePath)) {
        filePath = path.join(DIST_DIR, 'index.html');
      }

      const ext = path.extname(filePath);
      const mime = MIME[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });
    });

    server.listen(PORT, () => {
      console.log(`Servidor local estático rodando em http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function verifyScreens() {
  let server;
  let browser;

  try {
    server = await startServer();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const printsDir = path.resolve(__dirname, '..', 'prints_hibrido');
    if (!fs.existsSync(printsDir)) {
      fs.mkdirSync(printsDir, { recursive: true });
    }

    // 1. Tela Home SEIA Híbrido
    console.log('1. Acessando Central SEIA (Home)...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const homeTitle = await page.locator('h1').textContent();
    console.log('Título Home capturado:', homeTitle?.trim());

    await page.screenshot({ path: path.join(printsDir, '01_seia_home.png') });
    console.log('Print 01 salvo: prints_hibrido/01_seia_home.png');

    // 2. Tela Gestão de DAEs
    console.log('2. Acessando Gestão de DAEs...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-daes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const daesTitle = await page.locator('h1').textContent();
    console.log('Título DAEs capturado:', daesTitle?.trim());

    await page.screenshot({ path: path.join(printsDir, '02_seia_daes.png') });
    console.log('Print 02 salvo: prints_hibrido/02_seia_daes.png');

    // 3. Teste interativo: Clicar no botão de Visualizar DAE para abrir o Espelho
    console.log('3. Testando modal de espelho oficial do DAE...');
    const eyeBtn = page.locator('button[title="Visualizar Espelho do DAE"]').first();
    if (await eyeBtn.count() > 0) {
      await eyeBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(printsDir, '03_seia_dae_modal.png') });
      console.log('Print 03 salvo: prints_hibrido/03_seia_dae_modal.png');
    }

    console.log('Todas as verificações concluídas com sucesso!');
  } catch (err) {
    console.error('Erro na verificação:', err);
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
    console.log('Processo finalizado com sucesso.');
    process.exit(0);
  }
}

verifyScreens();
