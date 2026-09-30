const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== CRIANDO SOLICITAÇÃO DE CERTIDÃO DE DÉBITO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Acessar wizard de certidão
  await page.goto('https://gla-inema-hml.acto.com.br/certidao-debito-ambiental/solicitar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Marcar requerente
  console.log('1. Selecionando Requerente...');
  await page.locator('input[value="requerente"]').check();
  await page.waitForTimeout(1000);

  // Adicionar requerente
  console.log('2. Adicionando partícipe...');
  const addBtn = page.locator('button:has-text("Adicionar"), button[wire\\:click*="adicionarRequerente"]');
  if (await addBtn.count() > 0) {
    await addBtn.first().click();
    await page.waitForTimeout(2000);
  }

  // Avançar para resumo
  console.log('3. Clicando em Próximo...');
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(2000);

  // Aceitar declaração e finalizar
  console.log('4. Aceitando declaração e finalizando pedido...');
  const chk = page.locator('input[name="data.aceite_declaracao"]');
  if (await chk.count() > 0) {
    await chk.check();
    await page.waitForTimeout(500);
  }

  const finBtn = page.locator('button:has-text("Finalizar"), button:has-text("Finalizar e Gerar DAE")');
  if (await finBtn.count() > 0) {
    await finBtn.first().click();
    await page.waitForTimeout(3000);
    console.log('5. Solicitação finalizada! URL atual:', page.url());
  }

  // 6. Verificar Pauta da Área
  console.log('\n--- VERIFICANDO PAUTA DA ÁREA APÓS SOLICITAÇÃO ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rowsArea = await page.locator('table tbody tr').count();
  console.log('Linhas na Pauta da Área:', rowsArea);
  if (rowsArea > 0) {
    const textRow = await page.locator('table tbody tr').first().innerText();
    console.log('Primeiro processo na Pauta da Área:\n', textRow.replace(/\n+/g, ' | '));

    // Reter processo
    const btnReter = page.locator('table tbody tr').first().locator('button, a').first();
    console.log('Ação de retenção:', await btnReter.innerText().catch(() => ''));
    await btnReter.click();
    await page.waitForTimeout(2500);
  }

  // 7. Verificar Pauta Técnico
  console.log('\n--- VERIFICANDO PAUTA TÉCNICO ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rowsTec = await page.locator('table tbody tr').count();
  console.log('Linhas na Pauta Técnico:', rowsTec);
  if (rowsTec > 0) {
    const textTec = await page.locator('table tbody tr').first().innerText();
    console.log('Processo na Pauta Técnico:\n', textTec.replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
