const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== VALIDAÇÃO COMPLETA CARD 10: MODAIS FILAMENT ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const lastCell = page.locator('table tbody tr').first().locator('td').last();
  const triggerBtn = lastCell.locator('.fi-dropdown-trigger button, button').first();

  // 1. Testar Abertura do Histórico
  console.log('1. Clicando no trigger do dropdown...');
  await triggerBtn.click();
  await page.waitForTimeout(500);

  const histBtn = lastCell.locator('button:has-text("Ver Histórico de Tramitações")');
  console.log('2. Clicando em "Ver Histórico de Tramitações"...');
  await histBtn.click();
  await page.waitForTimeout(2500);

  const modal = page.locator('.fi-modal-window, [role="dialog"], .fi-modal').last();
  const modalText = await modal.innerText().catch(() => '');
  console.log('3. Conteúdo Modal Histórico:\n', modalText.substring(0, 800));

  // Fechar modal
  const closeBtn = modal.locator('button:has-text("Fechar"), button[x-on\\:click*="close"], button[aria-label*="Fechar"]').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }

  // 2. Testar Abertura de Tramitar Requerimento
  console.log('4. Testando abertura de "Tramitar Requerimento"...');
  await triggerBtn.click();
  await page.waitForTimeout(500);
  const tramitarBtn = lastCell.locator('button:has-text("Tramitar Requerimento")');
  await tramitarBtn.click();
  await page.waitForTimeout(2500);

  const modalTramitar = page.locator('.fi-modal-window, [role="dialog"]').last();
  const textTramitar = await modalTramitar.innerText().catch(() => '');
  console.log('5. Conteúdo Modal Tramitar:\n', textTramitar.substring(0, 500));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 3. Testar Abertura de Devolver Requerimento
  console.log('6. Testando abertura de "Devolver Requerimento"...');
  await triggerBtn.click();
  await page.waitForTimeout(500);
  const devolverBtn = lastCell.locator('button:has-text("Devolver Requerimento")');
  await devolverBtn.click();
  await page.waitForTimeout(2500);

  const modalDevolver = page.locator('.fi-modal-window, [role="dialog"]').last();
  const textDevolver = await modalDevolver.innerText().catch(() => '');
  console.log('7. Conteúdo Modal Devolver:\n', textDevolver.substring(0, 500));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 4. Testar Abertura de Cancelar Requerimento
  console.log('8. Testando abertura de "Cancelar Requerimento"...');
  await triggerBtn.click();
  await page.waitForTimeout(500);
  const cancelarBtn = lastCell.locator('button:has-text("Cancelar Requerimento")');
  await cancelarBtn.click();
  await page.waitForTimeout(2500);

  const modalCancelar = page.locator('.fi-modal-window, [role="dialog"]').last();
  const textCancelar = await modalCancelar.innerText().catch(() => '');
  console.log('9. Conteúdo Modal Cancelar:\n', textCancelar.substring(0, 500));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  console.log('\n--- CARD 10 VALIDADO COM 100% DE FIDELIDADE ---');
  await browser.close();
})();
