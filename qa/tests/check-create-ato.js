const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/portal/ato-ambiental/ato-ambientals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Ver botões na página
  const newBtn = page.locator('a:has-text("Novo"), button:has-text("Novo"), a:has-text("Criar"), button:has-text("Criar")');
  console.log('Botão Novo Ato count:', await newBtn.count());
  if (await newBtn.count() > 0) {
    console.log('Texto do botão:', await newBtn.first().innerText());
    await newBtn.first().click();
    await page.waitForTimeout(2000);
    console.log('URL criar ato:', page.url());

    // Inspecionar campos para criar um ato LA pro Caick
    const fields = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('label, select, input')).map(el => ({
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim() : '',
        name: el.getAttribute('name')
      })).filter(i => i.text || i.name);
    });
    console.log('Campos criar ato:\n', JSON.stringify(fields.slice(0, 20), null, 2));
  }

  await browser.close();
})();
