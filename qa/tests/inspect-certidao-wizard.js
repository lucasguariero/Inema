const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const href = await page.locator('a:has-text("Solicitar Certidão de Débito")').getAttribute('href');
  console.log('HREF Solicitar Certidão:', href);

  await page.goto(href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Aberta:', page.url());
  const bodyText = await page.innerText('body');
  console.log('Texto da tela de solicitação:\n', bodyText.substring(0, 1000).replace(/\n+/g, ' | '));

  // Preencher e submeter a solicitação de certidão para gerar um processo de teste
  const formFields = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      name: el.getAttribute('name') || el.getAttribute('wire:model'),
      text: el.innerText.trim(),
      value: el.value
    }));
  });
  console.log('Campos na solicitação:\n', formFields.filter(f => f.text.length > 0 || f.name));

  await browser.close();
})();
