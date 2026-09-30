const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function waitForServer(port, maxAttempts = 50) {
  for (let i = 0; i < maxAttempts; i++) {
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
  throw new Error(`Server did not respond on port ${port}`);
}

async function main() {
  const printsDir = path.resolve(__dirname, '../qa/prototipos-prioritarios-1080p');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  const PORT = 4182;
  console.log(`Iniciando Vite preview na porta ${PORT}...`);
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'ignore'
  });

  try {
    await waitForServer(PORT);
    console.log(`Servidor ativo em http://localhost:${PORT}/`);

    console.log('Iniciando navegador Playwright (1920x1080)...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

    const screens = [
      { name: '01-cerh-pauta.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=cerh` },
      { name: '02-dtrp-manifestos.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=dtrp` },
      { name: '03-reposicao-florestal.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=reposicao-florestal` },
      { name: '04-cnd-certidao-debito.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=certidao-debito` },
      { name: '05-ansla-dispensa.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=ansla` },
      { name: '06-parcelamento-debitos.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=parcelamento` },
      { name: '07-cras-fauna-animais.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=cras` },
      { name: '08-cefir-imoveis-rurais.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=cefir` },
      { name: '09-sispass-criadores.png', url: `http://localhost:${PORT}/?rota=seia-v2&tela=sispass` },
    ];

    for (const s of screens) {
      console.log(`Capturando: ${s.name} (${s.url})...`);
      await page.goto(s.url, { waitUntil: 'networkidle' });
      await page.waitForSelector('h1', { timeout: 15000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(printsDir, s.name) });
    }

    // Capturar também o formulário Wizard do CERH
    console.log('Capturando Wizard do CERH (10-cerh-wizard-form.png)...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-v2&tela=cerh`, { waitUntil: 'networkidle' });
    const btnCerh = page.locator('button:has-text("Nova Declaração / Outorga")');
    if (await btnCerh.count() > 0) {
      await btnCerh.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(printsDir, '10-cerh-wizard-form.png') });
    }

    // Capturar também o formulário Wizard do DTRP
    console.log('Capturando Wizard do DTRP (11-dtrp-wizard-manifesto.png)...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-v2&tela=dtrp`, { waitUntil: 'networkidle' });
    const btnDtrp = page.locator('button:has-text("Novo Manifesto DTRP")');
    if (await btnDtrp.count() > 0) {
      await btnDtrp.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(printsDir, '11-dtrp-wizard-manifesto.png') });
    }

    // Capturar prontuário no CRAS
    console.log('Capturando Prontuário CRAS (12-cras-prontuario-modal.png)...');
    await page.goto(`http://localhost:${PORT}/?rota=seia-v2&tela=cras`, { waitUntil: 'networkidle' });
    const btnProntuario = page.locator('button:has-text("Prontuário")').first();
    if (await btnProntuario.count() > 0) {
      await btnProntuario.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(printsDir, '12-cras-prontuario-modal.png') });
    }

    console.log('Todas as capturas 1920x1080 concluídas com sucesso em qa/prototipos-prioritarios-1080p/!');
    await browser.close();
  } finally {
    try {
      process.kill(server.pid);
    } catch(e) {}
  }
}

main().catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
