const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar todos os labels e inputs dentro do form
  const labels = await page.locator('label').all();
  console.log('Labels count:', labels.length);
  for (const l of labels) {
    const text = (await l.innerText()).trim();
    const forAttr = await l.getAttribute('for');
    if (text) console.log(`Label: "${text}" | for="${forAttr}"`);
  }

  await browser.close();
})();
