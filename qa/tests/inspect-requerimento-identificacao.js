const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  
  // Vamos logar com o Caick ou com o Admin para ver
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar wizard de requerimento
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  console.log('Informacoes URL:', page.url());

  // Clicar em Iniciar Requerimento / Avançar se houver
  const startBtn = page.locator('button:has-text("Iniciar"), a:has-text("Iniciar"), button:has-text("Avançar"), button:has-text("Próximo")');
  if (await startBtn.count() > 0) {
    await startBtn.first().click();
    await page.waitForTimeout(2000);
  }

  // Se já tiver na tela de identificacao
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Identificacao URL:', page.url());
  const radios = await page.locator('input[type="radio"]').all();
  console.log('Total radios:', radios.length);

  // Inspecionar os labels dos radios
  const radioLabels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(t => t.length > 0);
  });
  console.log('Labels de radios:\n', radioLabels);

  await browser.close();
})();
