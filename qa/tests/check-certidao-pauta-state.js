const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Inspecionar o banco/tabela de processos da Certidão de Débito
  // Vamos na listagem de DAEs e ver se tem link pro processo
  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 2. Acessar /pauta-certidao-debito
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Linhas em /pauta-certidao-debito:', await page.locator('table tbody tr').count());
  
  // 3. Acessar /pauta-tecnica-certidao-debito
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Linhas em /pauta-tecnica-certidao-debito:', await page.locator('table tbody tr').count());

  await browser.close();
})();
