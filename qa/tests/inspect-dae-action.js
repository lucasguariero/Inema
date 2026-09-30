const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const row = page.locator('table tbody tr').first();
  const allBtns = await row.locator('button, a').all();
  console.log('Total botões na linha:', allBtns.length);
  for (let i = 0; i < allBtns.length; i++) {
    const txt = (await allBtns[i].innerText().catch(() => '')).trim();
    const wire = await allBtns[i].getAttribute('wire:click').catch(() => '');
    const href = await allBtns[i].getAttribute('href').catch(() => '');
    console.log(`[${i}] text: "${txt}", wire: "${wire}", href: "${href}"`);
  }

  // Clicar especificamente no botão cujo texto é "Pagar"
  const btnPagar = row.locator('button:has-text("Pagar"), a:has-text("Pagar")');
  console.log('Existe botão Pagar:', await btnPagar.count());
  if (await btnPagar.count() > 0) {
    console.log('Clicando no botão Pagar...');
    await btnPagar.first().click();
    await page.waitForTimeout(2000);
    
    // Verificar se abriu modal
    const modals = await page.locator('.fi-modal-window, [role="dialog"]').allInnerTexts().catch(() => []);
    console.log('Modals abertos:', modals.map(m => m.replace(/\n+/g, ' | ')));
    
    // Se abriu modal de confirmação
    const submitBtn = page.locator('.fi-modal-window button[type="submit"], [role="dialog"] button[type="submit"], button:has-text("Confirmar")');
    if (await submitBtn.count() > 0) {
      console.log('Clicando submit no modal...');
      await submitBtn.first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Testar também Baixa Manual se ainda tiver emitido
  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Status linha 1 agora:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));

  await browser.close();
})();
