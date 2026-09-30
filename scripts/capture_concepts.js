const { chromium } = require('c:/Users/lguar/projetos/Inema/node_modules/@playwright/test');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1800 } });
  
  const fileUrl = 'file:///' + path.resolve('qa/direcao-arte-inema.html').replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle' });

  const cards = await page.$$('section.space-y-8 > div');
  if (cards.length >= 3) {
    await cards[0].screenshot({ path: 'qa/referencias-visuais/64-concept-01-nordic.png' });
    await cards[1].screenshot({ path: 'qa/referencias-visuais/65-concept-02-forest.png' });
    await cards[2].screenshot({ path: 'qa/referencias-visuais/66-concept-03-biophilic.png' });
    await cards[0].screenshot({ path: 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/64-concept-01-nordic.png' });
    await cards[1].screenshot({ path: 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/65-concept-02-forest.png' });
    await cards[2].screenshot({ path: 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/66-concept-03-biophilic.png' });
    console.log('Successfully captured individual concept cards!');
  }

  await browser.close();
})();
