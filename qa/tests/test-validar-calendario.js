const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar tela de validação do analista
  console.log('Acessando tela de validação de calendário anual...');
  await page.goto('https://gla-inema-hml.acto.com.br/validacao-calendario-anual', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const valText = await page.locator('main').innerText();
  console.log('Texto da Validação de Calendário Anual (primeiros 1000 chars):\n', valText.substring(0, 1000));

  await browser.close();
})();
