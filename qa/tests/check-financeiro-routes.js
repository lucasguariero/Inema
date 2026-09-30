const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(el => ({
      text: el.innerText.trim().replace(/\n+/g, ' '),
      href: el.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('dae') || l.href.includes('financeiro') || l.href.includes('pagamento')));
  });
  console.log('Links DAE / Financeiro:\n', JSON.stringify(links, null, 2));

  // Verificar /dae ou similar
  const testRoutes = ['/dae', '/financeiro', '/financeiro/dae', '/arrecadacao', '/daes'];
  for (const r of testRoutes) {
    await page.goto('https://gla-inema-hml.acto.com.br' + r, { waitUntil: 'networkidle' });
    console.log(`Rota: ${r} -> URL: ${page.url()} | Título: ${await page.title()}`);
  }

  await browser.close();
})();
