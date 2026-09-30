const { chromium } = require('c:/Users/lguar/projetos/Inema/node_modules/@playwright/test');
const fs = require('fs');
const path = require('path');

const targets = [
  { name: 'watershed', url: 'https://watershed.com' },
  { name: 'pachama', url: 'https://pachama.com' },
  { name: 'sylvera', url: 'https://www.sylvera.com' },
  { name: 'tremor', url: 'https://www.tremor.so' },
  { name: 'ramp', url: 'https://ramp.com' },
  { name: 'incident_io', url: 'https://incident.io' }
];

const outDir = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4';
const qaDir = 'c:/Users/lguar/projetos/Inema/qa/referencias-visuais';
if (!fs.existsSync(qaDir)) {
  fs.mkdirSync(qaDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });

  const results = [];

  for (const t of targets) {
    console.log(`Analyzing ${t.name} (${t.url})...`);
    const page = await context.newPage();
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);

      // Extract colors, background styles, and typography
      const styles = await page.evaluate(() => {
        const computedBody = window.getComputedStyle(document.body);
        const elements = Array.from(document.querySelectorAll('*'));
        const bgColors = new Set();
        const textColors = new Set();
        const borderColors = new Set();

        elements.slice(0, 300).forEach(el => {
          const s = window.getComputedStyle(el);
          if (s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.add(s.backgroundColor);
          if (s.color) textColors.add(s.color);
          if (s.borderColor && s.borderColor !== 'rgba(0, 0, 0, 0)') borderColors.add(s.borderColor);
        });

        return {
          bodyBg: computedBody.backgroundColor,
          fontFamily: computedBody.fontFamily,
          bgColors: Array.from(bgColors).slice(0, 10),
          textColors: Array.from(textColors).slice(0, 10),
          borderColors: Array.from(borderColors).slice(0, 10)
        };
      });

      const shotPathBrain = path.join(outDir, `ref-${t.name}.png`);
      const shotPathQa = path.join(qaDir, `ref-${t.name}.png`);
      await page.screenshot({ path: shotPathBrain });
      fs.copyFileSync(shotPathBrain, shotPathQa);

      results.push({ name: t.name, url: t.url, styles, screenshot: `ref-${t.name}.png` });
      console.log(`✓ Captured ${t.name}`);
    } catch (err) {
      console.warn(`Could not capture ${t.name}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(qaDir, 'research-results.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Research complete! Data saved to qa/referencias-visuais/research-results.json');
})();
