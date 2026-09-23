const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_revisoes_finais');

  console.log('Iniciando Vite Preview...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4175'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Acesso à raiz "/" deve abrir o novo Relatórios de Regulação (React)
    console.log('Testando acesso na raiz / ...');
    await page.goto('http://localhost:4175/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('URL atual após carregar /:', page.url());
    await page.screenshot({ path: path.join(screenshotsDir, '06_raiz_abre_relatorios.png') });

    // 2. Acesso ao Dashboard Gerencial da Naiane (?rota=dashboard)
    console.log('Testando acesso ao Dashboard Gerencial (?rota=dashboard)...');
    await page.goto('http://localhost:4175/?rota=dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '07_dashboard_gerencial_naiane.png') });

    console.log('Testes de rotas concluídos com sucesso!');
  } catch (err) {
    console.error('Erro na verificação:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
