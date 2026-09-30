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
    return Array.from(document.querySelectorAll('a, button')).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim().replace(/\n+/g, ' '),
      href: el.getAttribute('href')
    })).filter(l => l.text.toLowerCase().includes('certid') || (l.href && l.href.includes('certid')));
  });
  console.log('Links relacionados a Certidão:\n', JSON.stringify(links, null, 2));

  // Verificar rotas conhecidas
  const routes = [
    '/pauta-certidao-debito',
    '/pauta-tecnica-certidao-debito',
    '/minha-pauta-certidao-debito',
    '/processos-finalizados-certidao-debito',
    '/certidao-debito-ambiental',
    '/certidao-debito-ambiental/solicitar'
  ];

  for (const r of routes) {
    await page.goto('https://gla-inema-hml.acto.com.br' + r, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const title = await page.title();
    const h1 = await page.locator('h1').allInnerTexts().catch(() => []);
    const tableRows = await page.locator('table tbody tr').count();
    const tabs = await page.locator('[role="tab"], button:has-text("Aguardando"), button:has-text("Em Análise"), button:has-text("Todos")').allInnerTexts().catch(() => []);
    console.log(`Rota: ${r} | Título: ${title} | H1: ${h1.join(', ')} | Linhas: ${tableRows} | Tabs: ${tabs.join(' | ')}`);
  }

  await browser.close();
})();
