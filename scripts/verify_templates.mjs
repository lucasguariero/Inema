import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

async function main() {
  const server = spawn('npx', ['vite', 'preview', '--port', '4197', '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      if (d.toString().includes('4197') || d.toString().includes('Local:')) resolve();
    });
    setTimeout(resolve, 3000);
  });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await page.goto('http://localhost:4197/?rota=seia-v2&tela=design-system', { waitUntil: 'networkidle' });
    const sec = page.locator('#templates');
    await sec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'qa/design-system-verification/sec-templates-dashboard.png' });

    // Click on tab 2: Pauta / Data Grid
    await page.click('button:has-text("2. Pauta / Data Grid")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'qa/design-system-verification/sec-templates-tabela.png' });

    // Click on tab 3: Formulario / Wizard
    await page.click('button:has-text("3. Formulário / Wizard")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'qa/design-system-verification/sec-templates-wizard.png' });

    // Click on tab 4: Detalhes
    await page.click('button:has-text("4. Ficha / Detalhes de Processo")');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'qa/design-system-verification/sec-templates-detalhes.png' });

    console.log('Templates screenshots captured successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

main();
