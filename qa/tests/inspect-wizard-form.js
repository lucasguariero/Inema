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

  await page.goto('https://gla-inema-hml.acto.com.br/parcelamento/solicitar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar todos os campos visíveis e botões de adicionar
  const formInfo = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      name: el.getAttribute('name') || el.getAttribute('wire:model'),
      text: el.innerText.trim(),
      value: el.value,
      checked: el.checked,
      disabled: el.disabled
    }));
    return inputs;
  });

  console.log('Campos do formulário:\n', formInfo);

  await browser.close();
})();
