import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function main() {
  const printsDir = path.resolve('qa/design-system-verification');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  const server = spawn('npx', ['vite', 'preview', '--port', '4198', '--strictPort'], {
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      const str = d.toString();
      if (str.includes('4198') || str.includes('Local:')) resolve();
    });
    setTimeout(resolve, 3000);
  });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:4198/?rota=seia-v2&tela=design-system', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const sections = ['buttons', 'fields', 'badges', 'cards', 'table', 'wizard', 'feedback', 'patterns', 'accessibility'];
    for (const sec of sections) {
      const el = page.locator(`#${sec}`);
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(printsDir, `sec-${sec}.png`) });
        console.log(`Screenshot sec-${sec}.png salvo!`);
      }
    }
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

main();
