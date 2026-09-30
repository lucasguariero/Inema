const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const candidateUrls = [
    '/certidao-debito-ambiental/analise/10',
    '/certidao-debito-ambiental/analisar/10',
    '/certidao-debito-ambiental/10',
    '/certidao-debito-ambiental/10/edit',
    '/certidao-debito-ambiental/10/analise',
    '/pauta-certidao-debito/10',
    '/pauta-certidao-debito/10/analisar',
    '/pauta-tecnica-certidao-debito/10',
    '/pauta-tecnica-certidao-debito/10/analisar',
    '/minha-pauta-certidao-debito/10',
    '/minha-pauta-certidao-debito/10/analisar',
    '/analisar-certidao-debito/10',
    '/analise-certidao-debito/10'
  ];

  for (const url of candidateUrls) {
    const resp = await page.goto('https://gla-inema-hml.acto.com.br' + url, { waitUntil: 'networkidle' });
    const status = resp ? resp.status() : 'null';
    const title = await page.title();
    console.log(`${url} -> Status: ${status} | Title: ${title}`);
    if (status === 200 && !title.includes('Not Found') && !title.includes('404')) {
      console.log('   => ENCONTRADO! H1:', await page.locator('h1').allInnerTexts().catch(() => []));
      console.log('   => Texto:\n', (await page.innerText('body')).substring(0, 500).replace(/\n+/g, ' | '));
    }
  }

  await browser.close();
})();
