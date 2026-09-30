const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Step 1: clicar Próximo
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(2000);
  console.log('Step 2 URL:', page.url());

  const radios = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Opções no Step 2 (Tipo de Solicitação):\n', radios);

  // Marcar 'Regularização Ambiental do Empreendimento' ou Atos
  const opt1 = page.locator('label:has-text("Regularização Ambiental do Empreendimento")');
  if (await opt1.count() > 0) {
    await opt1.click();
    await page.waitForTimeout(1000);
  }

  // Avançar para próximo
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(2000);
  console.log('Step 3 URL:', page.url());

  const radiosStep3 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Opções no Step 3:\n', radiosStep3);

  await browser.close();
})();
