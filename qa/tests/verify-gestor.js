const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('URL após login:', page.url());
  const userName = await page.locator('.fi-user-menu, button[title*="menu"], .fi-topbar-item, .fi-avatar + span').allInnerTexts().catch(() => []);
  const body = await page.innerText('body');
  console.log('Nomes/Menu encontrados:', userName);
  console.log('Trecho do topo:', body.substring(0, 300).replace(/\n+/g, ' | '));

  // Verificar se acessa /minha-pauta-certidao-debito
  await page.goto('https://gla-inema-hml.acto.com.br/minha-pauta-certidao-debito', { waitUntil: 'networkidle' });
  console.log('Acessou Minha Pauta com Gestor. Título:', await page.title());

  await browser.close();
})();
