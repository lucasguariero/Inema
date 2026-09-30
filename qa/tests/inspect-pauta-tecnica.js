const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const bodyPautaTec = await page.innerText('main, .fi-main, body');
  console.log('Conteúdo Pauta Técnico:\n', bodyPautaTec.substring(0, 1500).replace(/\n+/g, ' | '));

  const ths = await page.locator('table th').allInnerTexts();
  console.log('Colunas Pauta Técnico:', ths.map(t => t.trim()).filter(Boolean));

  await browser.close();
})();
