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
  await page.waitForTimeout(2000);

  console.log('URL Certidão Débito Ambiental:', page.url());
  const bodyText = await page.innerText('body');
  console.log('Texto da tela:\n', bodyText.substring(0, 800).replace(/\n+/g, ' | '));

  // Inspecionar inputs e botões
  const formElements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button, a.fi-btn')).map(el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      text: el.innerText.trim(),
      value: el.value
    })).filter(e => e.text.length > 0 || e.type !== 'hidden');
  });

  console.log('Elementos do formulário:\n', formElements);

  await browser.close();
})();
