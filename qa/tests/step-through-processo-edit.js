const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/processos/8/edit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Clicar em Próximo para ir para a Etapa 2 (Requerente)
  console.log('Indo para Etapa 2 (Requerente)...');
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);

  // Inspecionar campos da Etapa 2
  const textStep2 = await page.innerText('main, .fi-main');
  console.log('=== ETAPA 2 ===\n', textStep2.replace(/\n+/g, ' | ').substring(0, 500));

  // Clicar em Próximo para ir para a Etapa 3 (Vínculos)
  console.log('Indo para Etapa 3 (Vínculos)...');
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);

  // Inspecionar campos da Etapa 3
  const textStep3 = await page.innerText('main, .fi-main');
  console.log('=== ETAPA 3 (VÍNCULOS) ===\n', textStep3.replace(/\n+/g, ' | ').substring(0, 800));

  const inputsStep3 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label, select, input')).map(el => ({
      text: el.innerText ? el.innerText.trim() : '',
      name: el.getAttribute('name')
    })).filter(i => i.text);
  });
  console.log('Campos na Etapa 3:\n', inputsStep3);

  await browser.close();
})();
