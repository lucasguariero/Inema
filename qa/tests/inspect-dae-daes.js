const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Título /dae/daes:', await page.title());
  console.log('Linhas na tabela:', await page.locator('table tbody tr').count());
  
  if (await page.locator('table tbody tr').count() > 0) {
    const textRows = await page.locator('table tbody tr').allInnerTexts();
    console.log('Primeiras 5 linhas:\n', textRows.slice(0, 5).map(r => r.replace(/\n+/g, ' | ')).join('\n'));
    
    // Inspecionar ações na primeira linha
    const actions = await page.locator('table tbody tr').first().locator('button, a').all();
    for (let i = 0; i < actions.length; i++) {
      console.log(`Ação [${i}]: text="${(await actions[i].innerText().catch(() => '')).trim()}" title="${await actions[i].getAttribute('title').catch(() => '')}" wire="${await actions[i].getAttribute('wire:click').catch(() => '')}"`);
    }
  }

  await browser.close();
})();
