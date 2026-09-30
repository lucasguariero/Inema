const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function waitForServer(port) {
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

async function main() {
  const printsDir = path.resolve(__dirname, '../qa/prototipos-prioritarios-1080p');
  const PORT = 4183;
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(PORT);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    console.log('Capturando roteiro de apresentacao...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-v2&tela=apresentacao`, { waitUntil: 'networkidle' });
    await page.waitForSelector('text=Roteiro de Apresentação', { timeout: 10000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(printsDir, '13-roteiro-apresentacao-thays.png') });
    console.log('Captura do roteiro concluida!');
    await browser.close();
  } finally {
    try { process.kill(server.pid); } catch(e) {}
  }
}

main().catch(console.error);
