const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  await page.goto('https://www.figma.com/design/LiFgbupBamKUnN9EtkF7uc/INEMA---Atividade-N%C3%A3o-Sujeitas-ao-Licenciamento-Ambiental?node-id=3371-5093&p=f&t=8It9c9GI3xnIXF9q-0', { waitUntil: 'networkidle', timeout: 60000 });
  
  // Accept cookies if present
  const btnCookie = page.getByRole('button', { name: /aceitar|accept/i });
  if (await btnCookie.count() > 0) {
    await btnCookie.first().click();
  }
  
  // Wait for canvas to load
  await page.waitForTimeout(15000);
  
  await page.screenshot({ path: 'qa/screenshots/teste-figma-loaded.png' });
  console.log('Screenshot salva com sucesso!');
  
  await browser.close();
})();
