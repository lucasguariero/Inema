const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const brainDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';

  const screens = [
    { rota: 'atendente', name: '01-denuncia-interna' },
    { rota: 'cidadao', name: '02-denuncia-externa' },
    { rota: 'emergencia-interna', name: '03-emergencia-interna' },
    { rota: 'emergencia-externa', name: '04-emergencia-externa' },
    { rota: 'consulta-externa', name: '05-consulta-externa' },
    { rota: 'consulta-interna', name: '06-consulta-interna-difis' },
  ];

  for (const s of screens) {
    console.log(`Testing screen: ${s.name} (?rota=${s.rota})...`);
    await page.goto(`http://localhost:3000/?rota=${s.rota}`, { waitUntil: 'networkidle' });

    // Test Light Mode
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('inema_dark_mode', 'false');
    });
    await page.waitForTimeout(500);

    // Click "Preencher Exemplo" if present
    const btnExemplo = await page.$('button:has-text("Preencher Exemplo")');
    if (btnExemplo) {
      await btnExemplo.click();
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: path.join(brainDir, `fisc-${s.name}-light.png`), fullPage: false });

    // Test Dark Mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('inema_dark_mode', 'true');
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(brainDir, `fisc-${s.name}-dark.png`), fullPage: false });
  }

  await browser.close();
  console.log('All 6 Fiscalização screens tested and captured successfully!');
})();
