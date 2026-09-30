const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function captureNewScreens() {
  const outputDir = path.join(__dirname, '../qa/parity-screens-1080p');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Start preview or serve dist
  const { preview } = require('vite');
  const server = await preview({
    preview: { port: 4199 },
  });

  const routes = [
    { name: '01-cadastros-basicos', url: 'http://localhost:4199/?rota=seia-v2&tela=cadastros-basicos' },
    { name: '02-enquadramento-pauta', url: 'http://localhost:4199/?rota=seia-v2&tela=enquadramento' },
    { name: '03-parametrizacoes-master', url: 'http://localhost:4199/?rota=seia-v2&tela=parametrizacao' },
    { name: '04-usuarios-roles-rbac', url: 'http://localhost:4199/?rota=seia-v2&tela=usuarios-roles' },
    { name: '05-cras-fauna-completo', url: 'http://localhost:4199/?rota=seia-v2&tela=cras' },
  ];

  for (const r of routes) {
    console.log(`Navigating to ${r.name}...`);
    await page.goto(r.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const screenshotPath = path.join(outputDir, `${r.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot: ${screenshotPath}`);
  }

  await browser.close();
  await server.close();
  console.log('All parity screenshots captured successfully.');
}

captureNewScreens().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
