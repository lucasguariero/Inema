import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function main() {
  const printsDir = path.resolve('qa/design-system-verification');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  console.log('Iniciando vite preview na porta 4199...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4199', '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      const str = d.toString();
      console.log('[Preview]', str.trim());
      if (str.includes('4199') || str.includes('Local:')) resolve();
    });
    server.stderr.on('data', (d) => console.error('[Preview err]', d.toString().trim()));
    setTimeout(resolve, 3000);
  });

  console.log('Iniciando browser Playwright...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('1. Acessando Design System...');
    await page.goto('http://localhost:4199/?rota=seia-v2&tela=design-system', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(printsDir, '01-design-system-overview.png') });
    console.log('Screenshot 01 salvo!');

    // Rolar para botões e campos
    const content = page.locator('#design-system-content');
    await content.evaluate((el) => el.scrollTo({ top: 900, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, '02-buttons-and-fields.png') });
    console.log('Screenshot 02 salvo!');

    // Rolar para tabela e wizard
    await content.evaluate((el) => el.scrollTo({ top: 2200, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, '03-tables-and-wizard.png') });
    console.log('Screenshot 03 salvo!');

    console.log('Validação concluída com sucesso!');
  } catch (err) {
    console.error('Erro na validação:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

main();
