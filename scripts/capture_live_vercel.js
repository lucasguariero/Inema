const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1536, height: 960 } });
  const page = await context.newPage();

  const outDir = path.resolve('C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4');

  await page.goto('https://inema-six.vercel.app/conceito-01', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'live-conceito-01.png') });

  await page.goto('https://inema-six.vercel.app/conceito-02', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'live-conceito-02.png') });

  await page.goto('https://inema-six.vercel.app/conceito-03', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, 'live-conceito-03.png') });

  await page.goto('https://inema-six.vercel.app/proposta-verde-azul', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'proposta-verde-azul-live.png') });
  console.log('Captured proposta-verde-azul-live.png');

  await page.goto('https://inema-six.vercel.app/proposta-verde', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'proposta-verde-live.png') });
  console.log('Captured proposta-verde-live.png');

  await browser.close();
  console.log('Live Vercel screenshots successfully captured!');
})();
