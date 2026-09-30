const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/reposicao-florestal/reposicao-florestals/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Passo 1
  await page.getByText('Requerente', { exact: true }).click();
  await page.waitForTimeout(1000);
  const emprBtn = page.locator('button[id*="empr"]').first();
  if (await emprBtn.count() > 0) {
    await emprBtn.click();
    await page.waitForTimeout(600);
    const opt = page.locator('[role="option"]:has-text("DTRP Demonstração")').first();
    if (await opt.count() > 0) await opt.click();
    else await page.locator('[role="option"]:visible').first().click();
    await page.waitForTimeout(600);
  }
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(2500);

  // Passo 2: Selecionar Incapacidade de Produção
  await page.getByText('Incapacidade de produção de volume', { exact: false }).first().click();
  await page.waitForTimeout(2000);

  // Clicar em Grande Consumidor = Não
  const radiosNao = page.getByText('Não', { exact: true });
  if (await radiosNao.count() > 0) {
    await radiosNao.first().click();
    console.log('Clicou em Não para Grande Consumidor');
    await page.waitForTimeout(1000);
  }

  // Buscar crédito 2026.000005
  console.log('\nInspecionando combobox de crédito vinculado...');
  const creditBtn = page.locator('button:has-text("Busque pelo número"), button[id*="credito"], button[id*="origem"]').first();
  if (await creditBtn.count() > 0) {
    await creditBtn.click();
    await page.waitForTimeout(1000);
    
    // Digitar na busca do combobox
    const searchInput = page.locator('input[type="search"]:visible, input[placeholder*="digitar"]:visible, input[placeholder*="pesquis"]:visible').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('000005');
      await page.waitForTimeout(1000);
    }
    
    const opts = await page.locator('[role="option"]:visible').allInnerTexts();
    console.log('Opções de crédito visíveis no combobox:\n', opts);

    const opt005 = page.locator('[role="option"]:visible:has-text("000005")').first();
    if (await opt005.count() > 0) {
      await opt005.click();
      console.log('Selecionou crédito 2026.000005!');
      await page.waitForTimeout(2500);
    }
  }

  const screenText = await page.locator('main').innerText();
  console.log('\nTexto após selecionar crédito (primeiros 1500 chars):\n', screenText.substring(0, 1500));

  // Preencher volume não produzido = 100
  console.log('\nPreenchendo volume não produzido = 100...');
  const volInput = page.locator('input[id*="volume_irregular"], input[name*="volume_irregular"], input[id*="volume_nao_produzido"]').first();
  if (await volInput.count() > 0) {
    await volInput.fill('100');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(2000);
    console.log('Volume 100 preenchido.');
  }

  // Verificar memória de cálculo calculada
  const finalCalcText = await page.locator('main').innerText();
  const memIdx = finalCalcText.indexOf('Memória de Cálculo');
  if (memIdx >= 0) {
    console.log('\n================ MEMÓRIA DE CÁLCULO ================');
    console.log(finalCalcText.substring(memIdx, memIdx + 500));
    console.log('====================================================');
  }

  await browser.close();
})();
