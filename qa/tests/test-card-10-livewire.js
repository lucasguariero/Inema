const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTANDO CLIQUE VIA LIVEWIRE/FORCE ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Executar a ação historico diretamente via evaluate ou click({ force: true })
  console.log('Disparando click no botão Histórico...');
  const res = await page.evaluate(() => {
    const btn = document.querySelector('button[wire\\:click*="historico"]');
    if (btn) {
      btn.click();
      return { found: true, wireClick: btn.getAttribute('wire:click') };
    }
    return { found: false };
  });
  console.log('Resultado disparo Histórico:', res);

  await page.waitForTimeout(3000);

  // Verificar se o modal apareceu
  const modalText = await page.locator('.fi-modal, [role="dialog"], [x-ref="modalContainer"]').innerText().catch(() => '');
  console.log('Modal text após disparo:\n', modalText.substring(0, 800));

  // Verificar campos específicos do Card 10 no modal
  console.log('\n--- VERIFICAÇÃO CAMPOS REQUISITO TL003/TL004 ---');
  console.log('Possui CPF/CNPJ:', modalText.includes('CPF') || modalText.includes('CNPJ') || modalText.includes('000.'));
  console.log('Possui CEFIR/CAR:', modalText.includes('CEFIR') || modalText.includes('CAR'));
  console.log('Possui Requerimento:', modalText.includes('Requerimento') || modalText.includes('2026.'));
  console.log('Possui Atos Vinculados:', modalText.includes('Atos') || modalText.includes('Ato'));
  console.log('Possui Abas Tramitação e Notificação:', modalText.includes('Tramitação') || modalText.includes('Notificação') || modalText.includes('Notificações'));

  await browser.close();
})();
