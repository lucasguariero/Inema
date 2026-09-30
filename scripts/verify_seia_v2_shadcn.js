import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  const outDir = path.resolve('qa/seia-v2-shadcn-verification');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const urls = [
    { name: '01-seia-v2-relatorios-default.png', url: 'http://localhost:4188/?rota=seia-v2' },
    { name: '02-seia-v2-tabela-processos.png', url: 'http://localhost:4188/?rota=seia-v2&tela=tabela' },
    { name: '03-seia-v2-formulario-unificado.png', url: 'http://localhost:4188/?rota=seia-v2&tela=formulario' },
    { name: '04-seia-v2-painel-analista.png', url: 'http://localhost:4188/?rota=seia-v2&tela=seia-painel' },
    { name: '05-seia-v2-dark-mode.png', url: 'http://localhost:4188/?rota=seia-v2&dark=true' },
  ];

  for (const item of urls) {
    console.log(`Navigating to ${item.url}...`);
    await page.goto(item.url, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    const targetPath = path.join(outDir, item.name);
    await page.screenshot({ path: targetPath, fullPage: false });
    console.log(`Saved screenshot: ${targetPath}`);
  }

  await browser.close();
  console.log('Capture complete!');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
