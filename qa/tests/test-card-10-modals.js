const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE CARD 10 DETALHADO: MODAIS, HISTÓRICOS E TRAMITAÇÃO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Validar Modal de Histórico de Tramitações
  console.log('\n--- 1. MODAL DE HISTÓRICO ---');
  const histBtn = page.getByRole('button', { name: /Ver Histórico de Tramitações/i }).first();
  if (await histBtn.count() > 0) {
    await histBtn.click();
    await page.waitForTimeout(1500);

    const modal = page.locator('.fi-modal, [role="dialog"], .modal').first();
    const modalText = await modal.innerText().catch(() => '');
    console.log('Conteúdo do Modal de Histórico:\n', modalText.substring(0, 1000));

    console.log('Histórico possui CPF/CNPJ:', modalText.includes('CPF') || modalText.includes('CNPJ') || modalText.includes('000.'));
    console.log('Histórico possui Requerimento:', modalText.includes('Requerimento') || modalText.includes('2026.'));
    console.log('Histórico possui CEFIR/CAR:', modalText.includes('CEFIR') || modalText.includes('CAR'));
    console.log('Histórico possui Abas / Tramitações:', modalText.includes('Tramitação') || modalText.includes('Tramitações') || modalText.includes('Data e Hora'));
    console.log('Histórico possui Notificações:', modalText.includes('Notificação') || modalText.includes('Notificações'));

    // Fechar modal
    const closeBtn = modal.locator('button:has-text("Fechar"), button[aria-label*="close" i], button[aria-label*="fechar" i]').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
  }

  // 2. Validar Modal de Tramitar Requerimento
  console.log('\n--- 2. MODAL DE TRAMITAR REQUERIMENTO ---');
  const tramitarBtn = page.getByRole('button', { name: /Tramitar Requerimento/i }).first();
  if (await tramitarBtn.count() > 0) {
    await tramitarBtn.click();
    await page.waitForTimeout(1500);

    const modalTramitar = page.locator('.fi-modal, [role="dialog"]').first();
    const textTramitar = await modalTramitar.innerText().catch(() => '');
    console.log('Modal Tramitar text:\n', textTramitar.substring(0, 600));

    console.log('Possui seleção de técnico:', textTramitar.includes('Técnico') || textTramitar.includes('Responsável') || textTramitar.includes('Analista'));
    console.log('Possui campo Justificativa:', textTramitar.includes('Justificativa') || textTramitar.includes('Motivo'));

    // Fechar sem submeter para preservar dados
    const closeBtn = modalTramitar.locator('button:has-text("Cancelar"), button:has-text("Fechar")').first();
    if (await closeBtn.count() > 0) await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // 3. Validar Modal Devolver Requerimento
  console.log('\n--- 3. MODAL DE DEVOLVER REQUERIMENTO ---');
  const devolverBtn = page.getByRole('button', { name: /Devolver Requerimento/i }).first();
  if (await devolverBtn.count() > 0) {
    await devolverBtn.click();
    await page.waitForTimeout(1500);

    const modalDevolver = page.locator('.fi-modal, [role="dialog"]').first();
    const textDevolver = await modalDevolver.innerText().catch(() => '');
    console.log('Modal Devolver text:\n', textDevolver.substring(0, 600));
    console.log('Pergunta confirmação devolução:', textDevolver.includes('devolver') || textDevolver.includes('certeza') || textDevolver.includes('confirmar'));

    const cancelDevolver = modalDevolver.locator('button:has-text("Cancelar"), button:has-text("Fechar")').first();
    if (await cancelDevolver.count() > 0) await cancelDevolver.click();
    await page.waitForTimeout(1000);
  }

  // 4. Validar Modal Cancelar Requerimento
  console.log('\n--- 4. MODAL DE CANCELAR REQUERIMENTO ---');
  const cancelarBtn = page.getByRole('button', { name: /Cancelar Requerimento/i }).first();
  if (await cancelarBtn.count() > 0) {
    await cancelarBtn.click();
    await page.waitForTimeout(1500);

    const modalCancelar = page.locator('.fi-modal, [role="dialog"]').first();
    const textCancelar = await modalCancelar.innerText().catch(() => '');
    console.log('Modal Cancelar text:\n', textCancelar.substring(0, 600));
    console.log('Possui justificativa de cancelamento:', textCancelar.includes('Justificativa') || textCancelar.includes('motivo'));

    const cancelCancelar = modalCancelar.locator('button:has-text("Cancelar"), button:has-text("Fechar")').first();
    if (await cancelCancelar.count() > 0) await cancelCancelar.click();
    await page.waitForTimeout(1000);
  }

  // 5. Validar Configuração de Colunas e Persistência
  console.log('\n--- 5. CONFIGURAÇÃO DE COLUNAS ---');
  const colToggleBtn = page.locator('button[title*="coluna" i], button[aria-label*="coluna" i]').first();
  if (await colToggleBtn.count() > 0) {
    await colToggleBtn.click();
    await page.waitForTimeout(1000);
    const colMenu = await page.locator('.fi-dropdown-panel, .dropdown-menu').innerText().catch(() => '');
    console.log('Colunas configuráveis disponíveis:\n', colMenu.replace(/\n+/g, ' | '));
  }

  await browser.close();
  console.log('\n=== VALIDAÇÃO DO CARD 10 CONCLUÍDA COM SUCESSO ===');
})();
