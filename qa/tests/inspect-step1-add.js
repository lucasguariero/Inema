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

  // Marcar Requerente
  await page.locator('input[value="requerente"]').check();
  await page.waitForTimeout(1500);

  // Inspecionar o HTML do step 1
  const step1Html = await page.evaluate(() => {
    const step = document.querySelector('[x-ref="step-form.participantes::data::wizard-step"]') || document.querySelector('.fi-fo-wizard-step');
    return step ? step.innerText : document.body.innerText;
  });

  console.log('Texto do Step 1 após selecionar Requerente:\n', step1Html);

  // Verificar todos os botões do formulário
  const btns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      wireClick: b.getAttribute('wire:click'),
      className: b.className
    })).filter(b => b.text.length > 0);
  });
  console.log('\nBotões na tela:', btns);

  await browser.close();
})();
