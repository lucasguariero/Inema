const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- 1. Navegando para /atividades-dispensadas/informacoes ---');
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL 1:', page.url());
  console.log('Title 1:', await page.title());
  const h1_1 = await page.locator('h1').allInnerTexts();
  console.log('H1s 1:', h1_1);
  const breadcrumb1 = await page.locator('nav[aria-label="Breadcrumb"], .fi-breadcrumbs').allInnerTexts();
  console.log('Breadcrumb 1:', breadcrumb1);
  await page.screenshot({ path: 'qa/screenshots/ansla-info.png' });

  console.log('\n--- 2. Navegando para /ansla/tela-inicial ---');
  await page.goto('https://gla-inema-hml.acto.com.br/ansla/tela-inicial', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL 2:', page.url());
  console.log('Title 2:', await page.title());
  const h1_2 = await page.locator('h1').allInnerTexts();
  console.log('H1s 2:', h1_2);
  const breadcrumb2 = await page.locator('nav[aria-label="Breadcrumb"], .fi-breadcrumbs').allInnerTexts();
  console.log('Breadcrumb 2:', breadcrumb2);
  await page.screenshot({ path: 'qa/screenshots/ansla-tela-inicial.png' });

  // Inspecionar botões ou links em tela inicial
  const buttons = await page.locator('button, a.fi-btn').allInnerTexts();
  console.log('Buttons/Action links:', buttons.map(b => b.replace(/\n/g, ' ')));

  await browser.close();
})();
