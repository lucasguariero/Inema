const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const processLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim().replace(/\n+/g, ' '),
      href: a.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('process') || l.text.toLowerCase().includes('process')));
  });
  console.log('Links com processo:\n', JSON.stringify(processLinks, null, 2));

  // Verificar /requerimento/requerimentos ou similar
  const testUrls = [
    '/requerimento/requerimentos',
    '/processos',
    '/processos/processos',
    '/certidao-debitos',
    '/certidao-debito'
  ];

  for (const u of testUrls) {
    await page.goto('https://gla-inema-hml.acto.com.br' + u, { waitUntil: 'networkidle' });
    console.log(`URL: ${u} | Status: ${page.url()} | Title: ${await page.title()}`);
    const rows = await page.locator('table tbody tr').count();
    console.log(`   Linhas na tabela: ${rows}`);
  }

  await browser.close();
})();
