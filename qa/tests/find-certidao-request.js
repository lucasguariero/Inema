const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Iniciar requerimento
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Iniciar Requerimento:', page.url());
  const links = await page.locator('a, button').evaluateAll(els => els.map(e => ({ text: e.innerText.trim(), href: e.href })));
  const certLinks = links.filter(l => l.text.toLowerCase().includes('certidão') || l.text.toLowerCase().includes('certidao') || (l.href && l.href.includes('certidao')));
  console.log('Links relacionados a Certidão:\n', certLinks);

  // Testar rotas diretas de certidão
  const routes = [
    '/solicitar-certidao-debito',
    '/requerimento/certidao-debito',
    '/certidao-debito/solicitar',
    '/certidao-debito'
  ];
  for (const r of routes) {
    await page.goto(`https://gla-inema-hml.acto.com.br${r}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const txt = await page.innerText('body');
    console.log(`Rota ${r} -> URL: ${page.url()} | 404: ${txt.includes('404')} | Title: ${txt.substring(0, 100).replace(/\n+/g, ' ')}`);
  }

  await browser.close();
})();
