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

  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental/solicitar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Selecionar e adicionar requerente
  await page.locator('input[value="requerente"]').check();
  await page.waitForTimeout(500);
  await page.locator('button:has-text("Adicionar")').click();
  await page.waitForTimeout(1500);

  // Avançar
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);

  console.log('Chegou na tela de Resumo. URL:', page.url());
  const bodyText = await page.innerText('body');
  console.log('Conteúdo da tela de Resumo:\n', bodyText.substring(0, 1000).replace(/\n+/g, ' | '));

  // Inspecionar botões e checkboxes
  const buttonsAndInputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, button')).map(el => ({
      tag: el.tagName,
      type: el.getAttribute('type'),
      text: el.innerText.trim(),
      wireClick: el.getAttribute('wire:click'),
      disabled: el.disabled,
      checked: el.checked
    }));
  });
  console.log('Elementos no Resumo:\n', buttonsAndInputs.filter(b => b.text.length > 0 || b.type === 'checkbox'));

  // Clicar no checkbox se existir
  const chk = page.locator('input[type="checkbox"]');
  if (await chk.count() > 0) {
    console.log('Marcando checkbox...');
    await chk.check();
    await page.waitForTimeout(1000);
  }

  // Clicar no botão Finalizar e Gerar DAE
  const finBtn = page.locator('button:has-text("Finalizar e Gerar DAE")');
  console.log('Botão Finalizar disabled:', await finBtn.isDisabled());
  console.log('Clicando em Finalizar e Gerar DAE...');
  await finBtn.click();
  await page.waitForTimeout(4000);

  console.log('URL após clicar finalizar:', page.url());
  console.log('Texto após finalizar:\n', (await page.innerText('body')).substring(0, 800).replace(/\n+/g, ' | '));

  await browser.close();
})();
