const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function verify() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const printsDir = path.join(__dirname, '..', 'prints_shadcn_isolated');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  console.log('Navegando para https://inema-moderno.vercel.app...');
  await page.goto('https://inema-moderno.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(printsDir, '01_dashboard_blue.png'), fullPage: false });
  console.log('Dashboard capturado em prints_shadcn_isolated/01_dashboard_blue.png');

  // Ativar Dark mode
  await page.goto('https://inema-moderno.vercel.app/?dark=true', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(printsDir, '02_dashboard_dark.png'), fullPage: false });
  console.log('Dark mode capturado em prints_shadcn_isolated/02_dashboard_dark.png');

  // Tela de Consulta Interna
  await page.goto('https://inema-moderno.vercel.app/?rota=consulta-interna', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(printsDir, '03_consulta_interna.png'), fullPage: false });
  console.log('Consulta Interna capturada em prints_shadcn_isolated/03_consulta_interna.png');

  await browser.close();
  console.log('Verificação finalizada com sucesso!');
}

verify().catch(err => {
  console.error('Erro na verificação:', err);
  process.exit(1);
});
