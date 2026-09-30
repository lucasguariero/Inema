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

  const row = page.locator('table tbody tr').filter({ hasText: 'DAE-2026-000033' }).first();
  const trigger = row.locator('button.fi-ac-icon-btn-group');
  console.log('Trigger count:', await trigger.count());

  await trigger.click();
  await page.waitForTimeout(1000);

  // Clicar no primeiro botão Baixa Manual de DAE
  const btnBaixa = row.locator('button:has-text("Baixa Manual de DAE")');
  console.log('Clicando em Baixa Manual...');
  await btnBaixa.click();
  await page.waitForTimeout(2500);

  // Inspecionar o modal aberto (excluindo os ocultos)
  const openModal = page.locator('.fi-modal-window:not([aria-hidden="true"])');
  console.log('Modal aberto count:', await openModal.count());
  if (await openModal.count() > 0) {
    console.log('Conteúdo modal de baixa:\n', (await openModal.first().innerText()).replace(/\n+/g, ' | '));

    // Confirmar se tem formulário de baixa ou botão de salvar/confirmar
    const confirmBtn = openModal.locator('button[type="submit"], button:has-text("Confirmar"), button:has-text("Salvar"), button:has-text("Baixar")');
    if (await confirmBtn.count() > 0) {
      console.log('Clicando no botão de confirmação da baixa...');
      await confirmBtn.first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Verificar status na tabela DAEs agora
  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rowAfter = page.locator('table tbody tr').filter({ hasText: 'DAE-2026-000033' }).first();
  console.log('Linha após baixa manual:\n', (await rowAfter.innerText()).replace(/\n+/g, ' | '));

  // Verificar Pauta da Área de Certidão de Débito
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Linhas na Pauta da Área:', await page.locator('table tbody tr').count());
  if (await page.locator('table tbody tr').count() > 0) {
    const pautaRow = await page.locator('table tbody tr').first().innerText();
    console.log('Processo na Pauta da Área:\n', pautaRow.replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
