const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function capture() {
  const outDir = path.join(__dirname, '..', 'qa', 'referencias-visuais');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const targets = [
    {
      name: 'watershed_platform',
      url: 'https://watershed.com/product',
      waitFor: 3000
    },
    {
      name: 'tremor_blocks',
      url: 'https://raw.tremor.so/blocks/kpi-cards',
      waitFor: 3000
    },
    {
      name: 'sylvera_ratings',
      url: 'https://www.sylvera.com/product/carbon-credit-ratings',
      waitFor: 3000
    }
  ];

  for (const t of targets) {
    try {
      console.log(`Navigating to ${t.url}...`);
      const page = await context.newPage();
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(t.waitFor);
      const outPath = path.join(outDir, `${t.name}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot to ${outPath}`);
      await page.close();
    } catch (err) {
      console.warn(`Failed to capture ${t.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('Capture script finished.');
}

capture();
