const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const imgPath = 'C:/Users/lguar/.gemini/antigravity/brain/9d40f7ca-ddfd-4ee6-853b-783f644bd6c4/.user_uploaded/media_1789517570158.png';
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  
  await page.setContent(`<canvas id="c"></canvas>`);
  const colors = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('c');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const toHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        const getPixel = (x, y) => {
          const p = ctx.getImageData(x, y, 1, 1).data;
          return toHex(p[0], p[1], p[2]);
        };

        // Vizora image is 1200x960 approx.
        // Sidebar is roughly left 200px
        resolve({
          sidebarBg: getPixel(140, 450),
          sidebarSearch: getPixel(140, 170),
          sidebarActive: getPixel(140, 255),
          exportButton: getPixel(885, 108),
          canvasBg: getPixel(500, 300),
          cardBg: getPixel(320, 200),
          greenMetric: getPixel(635, 195),
          greenChartLine: getPixel(510, 470),
        });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, imgBase64);

  console.log('Sampled Colors:', JSON.stringify(colors, null, 2));
  await browser.close();
})();
