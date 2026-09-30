const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const sidebarItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('aside a, .fi-sidebar a, nav a')).map(a => ({
      text: a.innerText.trim().replace(/\n+/g, ' '),
      href: a.getAttribute('href')
    }));
  });
  console.log('Sidebar items:\n', JSON.stringify(sidebarItems, null, 2));

  // Verificar o que tem na URL /pautas
  await page.goto('https://gla-inema-hml.acto.com.br/pautas', { waitUntil: 'networkidle' });
  console.log('/pautas Title:', await page.title());
  console.log('/pautas H1:', await page.locator('h1').allInnerTexts());

  // Verificar o que tem na URL /pauta-certidao-debito
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  console.log('/pauta-certidao-debito Title:', await page.title());
  console.log('/pauta-certidao-debito H1:', await page.locator('h1').allInnerTexts());

  await browser.close();
})();
