const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Procurar Reposição Florestal no menu lateral ou Iniciar Requerimento
  console.log('1. Procurando Reposição Florestal...');
  const links = await page.locator('aside a, nav a').all();
  for (const l of links) {
    const text = (await l.innerText()).trim();
    const href = await l.getAttribute('href');
    if (text.toLowerCase().includes('reposi') || text.toLowerCase().includes('florestal') || text.toLowerCase().includes('crf')) {
      console.log(`  Menu Link: "${text}" => ${href}`);
    }
  }

  // 2. Tentar Iniciar Requerimento
  console.log('\n2. Acessando Iniciar Requerimento...');
  await page.goto('https://gla-inema-hml.acto.com.br/iniciar-requerimento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const initText = await page.locator('main').innerText();
  console.log('Iniciar Requerimento (primeiros 1000 chars):\n', initText.substring(0, 1000));

  // Procurar card de Reposição Florestal
  const crfCard = page.locator('text=Reposição Florestal, text=Crédito de Reposição, a:has-text("Reposição Florestal")');
  console.log('Reposição Florestal presente em Iniciar Requerimento:', await crfCard.count());

  // 3. Tentar rota direta de reposição florestal
  const testUrls = [
    'https://gla-inema-hml.acto.com.br/reposicao-florestal',
    'https://gla-inema-hml.acto.com.br/reposicao-florestal/cadastrar',
    'https://gla-inema-hml.acto.com.br/reposicao-florestal/create',
    'https://gla-inema-hml.acto.com.br/requerimento/reposicao-florestal'
  ];

  for (const url of testUrls) {
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    console.log(`Testando URL: ${url} => status ${resp.status()} finalUrl: ${page.url()}`);
    if (resp.status() === 200 && !page.url().includes('login') && !page.url().endsWith('/')) {
      const title = await page.title();
      console.log('  Título:', title);
    }
  }

  await browser.close();
})();
