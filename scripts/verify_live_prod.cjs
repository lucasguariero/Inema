const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function testLive() {
  console.log('Testando ambiente de produção ao vivo...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const printsDir = path.resolve(__dirname, '..', 'prints_hibrido');
  if (!fs.existsSync(printsDir)) {
    fs.mkdirSync(printsDir, { recursive: true });
  }

  try {
    // 1. Home Híbrido ao vivo
    console.log('1. Acessando https://inema.acto.com.br/?rota=seia-home ...');
    const resHome = await page.goto('https://inema.acto.com.br/?rota=seia-home', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Status HTTP Home:', resHome.status());
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(printsDir, 'prod_01_seia_home.png') });
    console.log('Screenshot prod_01_seia_home.png salvo!');

    // 2. DAEs Híbrido ao vivo
    console.log('2. Acessando https://inema.acto.com.br/?rota=seia-daes ...');
    const resDaes = await page.goto('https://inema.acto.com.br/?rota=seia-daes', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Status HTTP DAEs:', resDaes.status());
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(printsDir, 'prod_02_seia_daes.png') });
    console.log('Screenshot prod_02_seia_daes.png salvo!');

    console.log('Validação em produção concluída com êxito!');
  } catch (err) {
    console.error('Erro na validação de produção:', err);
  } finally {
    await browser.close();
    console.log('Processo Playwright finalizado.');
    process.exit(0);
  }
}

testLive();
