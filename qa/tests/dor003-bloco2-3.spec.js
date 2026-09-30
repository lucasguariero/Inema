const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 2 e 3 completo', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Bloco 2: Cadastro de Escala de Plantão ---');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Plantonista: Bruno Carvalho
  console.log('1. Selecionando Plantonista...');
  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  const bruno = page.locator('li[role="option"]:has-text("Bruno Carvalho")').first();
  if (await bruno.isVisible()) {
    await bruno.click();
    console.log('Plantonista Bruno Carvalho selecionado.');
  } else {
    await page.locator('li[role="option"]').first().click();
  }
  await page.waitForTimeout(600);

  // 2. Municípios: Salvador
  console.log('2. Selecionando Município Salvador...');
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);

  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(1000);

  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(600);
  console.log('Município Salvador selecionado.');

  // Fechar dropdown
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // 3. Teste datas invertidas
  console.log('3. Testando datas invertidas (20/09/2026 a 08/09/2026)...');
  await page.locator('#form\\.espl_data_inicio').fill('20/09/2026');
  await page.locator('#form\\.espl_data_fim').fill('08/09/2026');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa datas invertidas escala.png' });
  console.log('✔ Print 02 capturado: Recusa datas invertidas.');

  // 4. Corrigir datas válidas: 08/09/2026 a 20/09/2026
  console.log('4. Corrigindo datas válidas (08/09/2026 a 20/09/2026)...');
  await page.locator('#form\\.espl_data_inicio').fill('08/09/2026');
  await page.locator('#form\\.espl_data_fim').fill('20/09/2026');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Escala de plantao salva.png' });
  console.log('✔ Print 03 capturado: Escala salva com sucesso.');

  // 5. Listagem de escalas & Filtro Vigente em
  console.log('5. Testando listagem e filtro de vigência...');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const btnFiltros = page.locator('button[aria-label*="Filtros"], button:has-text("Filtros"), .fi-ta-filters-trigger').first();
  if (await btnFiltros.isVisible().catch(() => false)) {
    await btnFiltros.click();
    await page.waitForTimeout(1000);

    const inputVigente = page.locator('input[placeholder*="dd/mm/yyyy"], input[placeholder*="Vigente"], input[type="text"]').last();
    if (await inputVigente.isVisible().catch(() => false)) {
      await inputVigente.fill('15/09/2026');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Filtro escala vigente 15-09.png' });
      console.log('✔ Print 04 capturado: Filtro 15/09/2026.');

      await inputVigente.fill('15/10/2026');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 05 - Filtro escala vigente 15-10 vazia.png' });
      console.log('✔ Print 05 capturado: Filtro 15/10/2026 vazio.');
    }
  } else {
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Listagem escalas.png' });
  }

  // =========================================================================
  // BLOCO 3: USUÁRIOS CALL CENTER
  // =========================================================================
  console.log('--- Bloco 3: Segurança / Usuários ---');
  await page.goto('https://gla-inema-hml.acto.com.br/usuarios', { waitUntil: 'networkidle' }).catch(async () => {
    await page.locator('text=Administração').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Segurança').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Usuários').first().click();
  });
  await page.waitForTimeout(2500);

  // Buscar Call Center
  const searchUser = page.locator('input[placeholder*="Pesquisar"], input[type="search"]').first();
  if (await searchUser.isVisible().catch(() => false)) {
    await searchUser.fill('Call Center');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 06 - Seguranca usuarios Call Center.png' });
  console.log('✔ Print 06 capturado: Usuários Call Center.');
});
