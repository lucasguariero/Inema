const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const outputDir = path.join(__dirname, '..', 'qa', 'prints_1080p_seia_v2');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview na porta 4182...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4182'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => setTimeout(resolve, 3500));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('[Browser Error]', msg.text());
  });

  const baseUrl = 'http://localhost:4182/?rota=seia-v2';

  try {
    console.log('1. Capturando Login SEIA V2...');
    await page.goto(`${baseUrl}&tela=login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '01_login_seia_v2.png') });

    console.log('2. Capturando Pauta de Enquadramento...');
    await page.goto(`${baseUrl}&tela=pauta-enquadramento`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '02_pauta_enquadramento.png') });

    console.log('3. Capturando Parecer Técnico & PDF Preview Drawer...');
    const btnParecer = page.locator('button:has-text("Emitir Parecer")').first();
    if (await btnParecer.isVisible()) {
      await btnParecer.click();
      await page.waitForTimeout(800);
      const btnGerarPdf = page.locator('button:has-text("Gerar e Visualizar Parecer Oficial em PDF")');
      if (await btnGerarPdf.isVisible()) {
        await btnGerarPdf.click();
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(outputDir, '03_pdf_drawer_parecer.png') });
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    }

    console.log('4. Capturando Omnisearch Global (Ctrl+K)...');
    await page.goto(`${baseUrl}&tela=dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(outputDir, '04_omnisearch_command_palette.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    console.log('5. Capturando Cadastros Básicos...');
    await page.goto(`${baseUrl}&tela=cadastros-basicos`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '05_cadastros_basicos.png') });

    console.log('6. Capturando Parametrizações Master...');
    await page.goto(`${baseUrl}&tela=parametrizacoes-master`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '06_parametrizacoes_master.png') });

    console.log('7. Capturando Usuários, Perfis e Auditoria...');
    await page.goto(`${baseUrl}&tela=usuarios-roles`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '07_usuarios_perfis_auditoria.png') });

    console.log('8. Capturando CRAS & Fauna Silvestre...');
    await page.goto(`${baseUrl}&tela=cras-fauna`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '08_cras_fauna.png') });

    console.log('9. Capturando CND e PDF Preview Drawer...');
    await page.goto(`${baseUrl}&tela=certidao-debito`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await page.fill('input[placeholder*="CPF"]', '12.345.678/0001-90');
    await page.click('button:has-text("Emitir Certidão")');
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '09_certidao_cnd_emitida.png') });

    const btnVisualizarPdfCnd = page.locator('button:has-text("Visualizar / Imprimir PDF")');
    if (await btnVisualizarPdfCnd.isVisible()) {
      await btnVisualizarPdfCnd.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outputDir, '10_pdf_drawer_cnd.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    console.log('10. Capturando DTRP e PDF Preview Drawer...');
    await page.goto(`${baseUrl}&tela=dtrp`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '11_dtrp_manifestos.png') });

    const btnPdfDtrp = page.locator('button:has-text("PDF")').first();
    if (await btnPdfDtrp.isVisible()) {
      await btnPdfDtrp.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outputDir, '12_pdf_drawer_dtrp.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }

    console.log('Todas as capturas foram salvas em qa/prints_1080p_seia_v2/');
  } catch (err) {
    console.error('Erro durante a captura:', err);
  } finally {
    try {
      await browser.close();
      if (server && server.pid) {
        require('child_process').execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
      }
    } catch (_) {}
    process.exit(0);
  }
}

main();
