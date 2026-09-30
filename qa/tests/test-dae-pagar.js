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

  // Procurar botão "Pagar" na primeira linha
  const pagarBtn = page.locator('table tbody tr').first().locator('button:has-text("Pagar"), a:has-text("Pagar")');
  console.log('Botão Pagar encontrado:', await pagarBtn.count());
  if (await pagarBtn.count() > 0) {
    console.log('Clicando em Pagar...');
    await pagarBtn.first().click();
    await page.waitForTimeout(2000);
    console.log('Modal ou URL após Pagar:', page.url());
    const modalText = await page.locator('.fi-modal, [role="dialog"]').allInnerTexts().catch(() => []);
    console.log('Modal texto:\n', modalText.join('\n'));

    // Se houver botão de confirmação dentro do modal
    const confirmBtn = page.locator('.fi-modal button[type="submit"], [role="dialog"] button:has-text("Confirmar"), [role="dialog"] button:has-text("Pagar"), [role="dialog"] button:has-text("Salvar")');
    if (await confirmBtn.count() > 0) {
      console.log('Confirmando pagamento...');
      await confirmBtn.first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Verificar status na tabela DAEs agora
  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const row1 = await page.locator('table tbody tr').first().innerText();
  console.log('Linha 1 após pagamento:\n', row1.replace(/\n+/g, ' | '));

  // Verificar Pauta da Área de Certidão de Débito
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Linhas na Pauta da Área:', await page.locator('table tbody tr').count());
  if (await page.locator('table tbody tr').count() > 0) {
    console.log('Processo na Pauta da Área:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
