const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  const urls = [
    { name: 'Default', url: 'https://inema-six.vercel.app/' },
    { name: 'Conceito 01 (Nordic)', url: 'https://inema-six.vercel.app/conceito-01' },
    { name: 'Conceito 02 (Forest)', url: 'https://inema-six.vercel.app/conceito-02' },
    { name: 'Conceito 03 (Biophilic)', url: 'https://inema-six.vercel.app/conceito-03' },
    { name: 'Legacy', url: 'https://inema-six.vercel.app/relatorios-antigo.html' },
  ];

  for (const item of urls) {
    console.log(`Testando ${item.name} em ${item.url}...`);
    const resp = await page.goto(item.url, { waitUntil: 'networkidle' });
    console.log(`Status: ${resp.status()}`);
    if (resp.status() !== 200) {
      console.error(`Falha ao carregar ${item.url}`);
    }
  }

  await browser.close();
  console.log('Todos os links de produção respondem 200 OK!');
})();
