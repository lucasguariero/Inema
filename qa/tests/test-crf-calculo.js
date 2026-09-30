const { chromium } = require('playwright');

async function login(page, cpf, pwd) {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill(cpf);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await login(page, '00000000000', 'admin123');
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

  // Passo 2: Modalidade
  await page.locator('text=Incapacidade de produção').first().click();
  await page.waitForTimeout(1500);

  // Grande Consumidor = Não
  await page.locator('text=Grande Consumidor').locator('..').locator('..').getByText('Não', { exact: true }).first().click();
  await page.waitForTimeout(800);

  // Buscar crédito 2026.000005
  console.log('Buscando crédito 000005...');
  const searchCreditBtn = page.locator('button:has-text("Busque pelo número"), button[id*="credito"]').first();
  if (await searchCreditBtn.count() > 0) {
    await searchCreditBtn.click();
    await page.waitForTimeout(800);
    const searchInput = page.locator('input[type="search"]:visible, input[placeholder*="digitar"]:visible, input[placeholder*="pesquis"]:visible').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('000005');
      await page.waitForTimeout(1000);
    }
    const creditOpt = page.locator('[role="option"]:has-text("000005"), [role="option"]:has-text("2026.000005")').first();
    if (await creditOpt.count() > 0) {
      console.log('Crédito encontrado! Clicando...');
      await creditOpt.click();
      await page.waitForTimeout(2000);
    } else {
      const opts = await page.locator('[role="option"]:visible').allInnerTexts();
      console.log('Opções de crédito visíveis:', opts);
      if (opts.length > 0) await page.locator('[role="option"]:visible').first().click();
      await page.waitForTimeout(2000);
    }
  }

  // Preencher volume não produzido = 100
  console.log('Informando volume não produzido = 100 m³...');
  const volumeInputs = await page.locator('input[type="text"]:visible, input[type="number"]:visible').all();
  for (const vi of volumeInputs) {
    const lbl = await vi.evaluate(el => {
      const p = el.closest('.fi-fo-field-wrp') || el.parentElement;
      return p ? p.textContent.trim() : '';
    });
    if (lbl.includes('Volume não produzido')) {
      await vi.fill('100');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1500);
      console.log('Campo de volume preenchido com 100.');
      break;
    }
  }

  // Selecionar motivo = Seca / evento climático
  console.log('Selecionando motivo da incapacidade...');
  const motivoSelect = page.locator('select:has-text("motivo"), select[id*="motivo"]').first();
  const motivoBtn = page.locator('button[id*="motivo"]').first();
  if (await motivoSelect.count() > 0) {
    await motivoSelect.selectOption({ label: 'Seca / evento climático' });
    await page.waitForTimeout(1000);
  } else if (await motivoBtn.count() > 0) {
    await motivoBtn.click();
    await page.waitForTimeout(600);
    await page.locator('[role="option"]:has-text("Seca")').first().click();
    await page.waitForTimeout(1000);
  }

  // Extrair a Memória de Cálculo após informar 100 m³
  const calcText = await page.locator('main').innerText();
  const memIdx = calcText.indexOf('Memória de Cálculo');
  if (memIdx >= 0) {
    console.log('\n--- MEMÓRIA DE CÁLCULO CALCULADA ---');
    console.log(calcText.substring(memIdx, memIdx + 500));
  }

  await browser.close();
})();
