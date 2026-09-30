const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE WIZARD: SELEÇÃO QUEM SOU EU & AVANÇO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/parcelamento/solicitar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Selecionar Requerente
  console.log('1. Selecionando opção "Requerente"...');
  const radioRequerente = page.locator('input[value="requerente"]');
  await radioRequerente.check();
  await page.waitForTimeout(2000);

  console.log(' - Radio marcado:', await radioRequerente.isChecked());

  // Verificar se apareceu tabela ou dados de partícipe
  const tableText = await page.locator('table').first().innerText().catch(() => '');
  console.log(' - Tabela de partícipes após selecionar Requerente:\n', tableText.replace(/\n+/g, ' | '));

  // 2. Clicar em Próximo
  console.log('2. Clicando em Próximo...');
  const nextBtn = page.locator('button:has-text("Próximo")');
  await nextBtn.click();
  await page.waitForTimeout(2000);

  // 3. Verificar se avançou para Etapa 2 (Processo)
  const bodyTextStep2 = await page.innerText('body');
  const hasProcesso = bodyTextStep2.includes('Número do processo') || bodyTextStep2.includes('Incluir Processo');
  console.log('3. Avançou para Etapa 2 (Processo):', hasProcesso);

  // 4. Testar inclusão de processo na Etapa 2
  if (hasProcesso) {
    console.log('4. Inserindo número de processo na Etapa 2...');
    const numInput = page.locator('input[name="data.numero_processo"]');
    await numInput.fill('2026.000.123456');
    await page.waitForTimeout(500);

    const btnIncluir = page.locator('button:has-text("Incluir Processo")');
    await btnIncluir.click();
    await page.waitForTimeout(2000);

    console.log(' - Tabela de processos na Etapa 2:\n', (await page.locator('table').nth(1).innerText().catch(() => '')).replace(/\n+/g, ' | '));

    // 5. Testar botão Anterior (persistência)
    console.log('5. Testando botão Anterior para conferir persistência...');
    const prevBtn = page.locator('button:has-text("Anterior")');
    await prevBtn.click();
    await page.waitForTimeout(2000);

    console.log(' - Retornou à Etapa 1:', (await page.innerText('body')).includes('Quem sou eu'));
    console.log(' - Requerente continuou marcado:', await radioRequerente.isChecked());

    // 6. Avançar até a Etapa 3 (Resumo)
    console.log('6. Avançando para Etapa 2...');
    await nextBtn.click();
    await page.waitForTimeout(1500);

    console.log('7. Avançando para Etapa 3 (Resumo)...');
    await nextBtn.click();
    await page.waitForTimeout(2000);

    const bodyStep3 = await page.innerText('body');
    console.log('8. Chegou na Etapa 3 (Resumo):', bodyStep3.includes('Resumo'));
    console.log(' - Termo de veracidade:', bodyStep3.includes('Declaro') || bodyStep3.includes('verdadeiras'));

    const checkboxTermo = page.locator('input[name="data.aceite_declaracao"]');
    console.log(' - Checkbox termo presente:', await checkboxTermo.count() > 0);

    const btnFinalizar = page.locator('button:has-text("Finalizar Pedido")');
    console.log(' - Botão Finalizar Pedido disabled antes do termo:', await btnFinalizar.isDisabled());

    // Marcar checkbox
    if (await checkboxTermo.count() > 0) {
      await checkboxTermo.check();
      await page.waitForTimeout(1000);
      console.log(' - Botão Finalizar Pedido disabled após termo:', await btnFinalizar.isDisabled());
    }
  }

  await browser.close();
})();
