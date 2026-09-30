const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir na edição do processo 8
  await page.goto('https://gla-inema-hml.acto.com.br/processos/8/edit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Clicar na aba Vínculos
  const tabVinculos = page.locator('button:has-text("Vínculos"), [role="tab"]:has-text("Vínculos")');
  if (await tabVinculos.count() > 0) {
    await tabVinculos.first().click();
    await page.waitForTimeout(1500);
    const textVinc = await page.innerText('main, .fi-main, form');
    console.log('=== ABA VÍNCULOS ===\n', textVinc.replace(/\n+/g, ' | ').substring(0, 1000));
  }

  // Clicar na aba Finalização
  const tabFin = page.locator('button:has-text("Finalização"), [role="tab"]:has-text("Finalização")');
  if (await tabFin.count() > 0) {
    await tabFin.first().click();
    await page.waitForTimeout(1500);
    const textFin = await page.innerText('main, .fi-main, form');
    console.log('\n=== ABA FINALIZAÇÃO ===\n', textFin.replace(/\n+/g, ' | ').substring(0, 1000));
  }

  await browser.close();
})();
