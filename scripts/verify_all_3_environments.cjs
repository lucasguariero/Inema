const { chromium } = require('@playwright/test');

async function testThree() {
  const browser = await chromium.launch({ headless: true });
  const targets = [
    { name: '1. Inema Legado', url: 'https://inema-legado.vercel.app' },
    { name: '2. Novo INEMA (Moderno)', url: 'https://inema-moderno.vercel.app' },
    { name: '3. INEMA Híbrido (Merge)', url: 'https://inema.acto.com.br' }
  ];

  for (const t of targets) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      const res = await page.goto(t.url, { waitUntil: 'networkidle', timeout: 25000 });
      const status = res.status();
      const title = await page.title();
      const h1s = await page.locator('h1').allInnerTexts();
      console.log(`=== ${t.name} ===`);
      console.log(`URL: ${t.url}`);
      console.log(`Status HTTP: ${status}`);
      console.log(`Title: ${title}`);
      console.log(`H1: ${JSON.stringify(h1s)}`);
      console.log('');
    } catch (e) {
      console.error(`=== ${t.name} === ERROR:`, e.message);
    }
    await page.close();
  }

  await browser.close();
  process.exit(0);
}

testThree();
