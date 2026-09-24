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
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:4199/?analista=maria', { waitUntil: 'networkidle' });
  await page.click('button:has-text("Acompanhamento da pauta")');
  await page.waitForTimeout(600);
  const btn = page.locator('table button:has-text("Detalhar")').first();
  await btn.scrollIntoViewIfNeeded();
  console.log('Clicking Detalhar button...');
  await btn.click({ force: true });
  await page.waitForTimeout(1000);
  const drawer = await page.locator('text=PAINEL DE RESUMO').count();
  console.log('Drawer count:', drawer);
  await page.screenshot({ path: path.resolve(__dirname, '../cards/relatorios-regulacao-maria/prints/Print 15 - Aba 2 Drawer Nivel 1 Contextualizado da Pauta (1080p).png') });
  await browser.close();
  server.close();
  console.log('Finished testing Print 15!');
})();
