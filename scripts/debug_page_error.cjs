const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const http = require('http');

async function waitForServer(port) {
  for (let i = 0; i < 30; i++) {
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

async function run() {
  const PORT = 4178;
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(PORT);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', err => {
      console.error('ERROR MESSAGE:', err.message);
      console.error('ERROR STACK:', err.stack);
    });

    console.log('Navegando para cerh...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-v2&tela=cerh`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await browser.close();
  } finally {
    try { process.kill(server.pid); } catch(e) {}
  }
}

run().catch(console.error);
