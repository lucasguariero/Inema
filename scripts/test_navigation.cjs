const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  console.log('Final URL after /:', page.url());
  await page.screenshot({ path: 'public/test-root-after.png' });

  const links = await page.locator('nav a').allInnerTexts();
  console.log('Sidebar links in relatorios-antigo:', links.map(l => l.replace(/\s+/g, ' ').trim()));

  console.log('Clicking on Cadastro de Plantonista...');
  await page.click('text=Cadastro de Plantonista');
  await page.waitForLoadState('networkidle');
  console.log('URL after click:', page.url());
  await page.screenshot({ path: 'public/test-plantonista-after.png' });

  const reactLinks = await page.locator('nav a').allInnerTexts();
  console.log('Sidebar links in React app:', reactLinks.map(l => l.replace(/\s+/g, ' ').trim()));

  console.log('Clicking on Agendamento de Visitacao...');
  await page.click('text=Agendamento de Visitação');
  await page.waitForLoadState('networkidle');
  console.log('URL after click UC:', page.url());
  await page.screenshot({ path: 'public/test-uc-after.png' });

  await browser.close();
  console.log('Done Playwright verification.');
})();
