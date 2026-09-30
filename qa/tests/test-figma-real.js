const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  await page.goto('https://www.figma.com/design/LiFgbupBamKUnN9EtkF7uc/INEMA---Atividade-N%C3%A3o-Sujeitas-ao-Licenciamento-Ambiental?node-id=3371-5093&p=f&t=8It9c9GI3xnIXF9q-0', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  console.log('URL final:', page.url());
  console.log('Título:', await page.title());
  await page.screenshot({ path: 'qa/screenshots/teste-figma-real.png' });
  
  await browser.close();
})();
