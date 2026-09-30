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
  await page.locator('label:has-text("Incapacidade de produção"), text=Incapacidade de produção').first().click();
  await page.waitForTimeout(2000);

  // Inspecionar radios na tela
  const radios = await page.locator('input[type="radio"]:visible').all();
  console.log('Radios visíveis:', radios.length);
  for (let i = 0; i < radios.length; i++) {
    const val = await radios[i].getAttribute('value');
    const name = await radios[i].getAttribute('name');
    const id = await radios[i].getAttribute('id');
    const text = await radios[i].evaluate(el => el.closest('label') ? el.closest('label').textContent.trim() : '');
    console.log(`Radio ${i}: id=${id} name=${name} val=${val} text="${text}"`);
    if (name && name.includes('grande_consumidor') && (val === '0' || text === 'Não')) {
      await radios[i].click();
      console.log('-> Clicou em Grande Consumidor = Não');
      await page.waitForTimeout(1000);
    }
  }

  // Buscar crédito 2026.000005
  console.log('\nInspecionando combobox de crédito vinculado...');
  const creditBtn = page.locator('button[id*="refl_id_origem"], button[id*="credito"], button:has-text("Busque pelo número")').first();
  if (await creditBtn.count() > 0) {
    await creditBtn.click();
    await page.waitForTimeout(1000);
    const opts = await page.locator('[role="option"]:visible').allInnerTexts();
    console.log('Opções de crédito visíveis no combobox:\n', opts);
    
    // Clicar na opção 2026.000005
    const opt005 = page.locator('[role="option"]:visible:has-text("000005")').first();
    if (await opt005.count() > 0) {
      await opt005.click();
      console.log('Selecionou crédito 2026.000005!');
      await page.waitForTimeout(2500);
    }
  }

  const screenText = await page.locator('main').innerText();
  console.log('\nTexto após selecionar crédito (primeiros 1500 chars):\n', screenText.substring(0, 1500));

  await browser.close();
})();
