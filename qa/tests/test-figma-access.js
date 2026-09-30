const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  console.log('Tentando acessar link do Figma...');
  await page.goto('https://www.figma.com/design/LiFgbupBamKUnN9EtkF7uc/INEMA---Atividade-N%C3%A3o-Sujeitas-ao-Licenciamento-Ambiental?node-id=3371-5093&p=f&t=8It9c9GI3xnIXF9q-0', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  console.log('URL final:', page.url());
  console.log('Título da página:', await page.title());
  
  await page.screenshot({ path: 'qa/screenshots/teste-figma.png' });
  console.log('Screenshot salvo em qa/screenshots/teste-figma.png');
  
  await browser.close();
})();
