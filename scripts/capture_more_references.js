const { chromium } = require('c:/Users/lguar/projetos/Inema/node_modules/@playwright/test');
const fs = require('fs');
const path = require('path');

const targets = [
  { name: 'watershed-platform', url: 'https://watershed.com/platform' },
  { name: 'sylvera-platform', url: 'https://www.sylvera.com/platform' },
  { name: 'pachama-business', url: 'https://pachama.com/business/' },
  { name: 'tremor-blocks', url: 'https://tremor.so/blocks' },
  { name: 'linear-features', url: 'https://linear.app/features' },
  { name: 'ramp-product', url: 'https://ramp.com/bill-pay' }
];

const outDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';
const qaDir = 'c:/Users/lguar/projetos/Inema/qa/referencias-visuais';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  for (const t of targets) {
    console.log(`Capturing ${t.name}...`);
    const page = await context.newPage();
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(3000);
      // Scroll down slightly to trigger lazy-loaded dashboard previews
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(2000);

      const shotPathBrain = path.join(outDir, `ref-${t.name}.png`);
      const shotPathQa = path.join(qaDir, `ref-${t.name}.png`);
      await page.screenshot({ path: shotPathBrain });
      fs.copyFileSync(shotPathBrain, shotPathQa);
      console.log(`✓ Saved ${t.name}`);
    } catch (e) {
      console.warn(`Failed ${t.name}:`, e.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('Finished capturing platform previews.');
})();
