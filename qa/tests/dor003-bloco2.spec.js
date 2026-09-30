const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 2: Escala de Plantão e Validações', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Acessando Cadastro de Escala de Plantão ---');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Plantonista: Bruno Carvalho se disponível, senão primeiro
  console.log('Selecionando Plantonista...');
  await page.locator('#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  const brunoOpt = page.locator('[role="option"]:has-text("Bruno Carvalho")').first();
  if (await brunoOpt.isVisible().catch(() => false)) {
    await brunoOpt.click();
    console.log('Selecionado: Bruno Carvalho');
  } else {
    const firstOpt = page.locator('[role="option"]').first();
    const txt = await firstOpt.innerText();
    console.log('Selecionando:', txt);
    await firstOpt.click();
  }
  await page.waitForTimeout(500);

  // 2. Municípios: Salvador
  console.log('Selecionando Município Salvador...');
  await page.locator('#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchMun = page.locator('input[placeholder*="digitar"]:visible, input[type="search"]:visible').first();
  if (await searchMun.isVisible().catch(() => false)) {
    await searchMun.fill('Salvador');
    await page.waitForTimeout(800);
  }
  const salvaldorOpt = page.locator('[role="option"]:has-text("Salvador"), div:has-text("Salvador")').filter({ hasText: /^Salvador$/ }).first();
  if (await salvaldorOpt.isVisible().catch(() => false)) {
    await salvaldorOpt.click();
    console.log('Salvador selecionado');
  } else {
    console.log('Clicando na opção com texto Salvador...');
    await page.locator('text=Salvador').last().click();
  }
  await page.waitForTimeout(500);

  // Fechar dropdown clicando no título
  await page.locator('h1:has-text("Criar Escala De Plantão")').click();
  await page.waitForTimeout(500);

  // 3. Teste datas invertidas: Início 20/09/2026, Fim 08/09/2026
  console.log('Preenchendo datas invertidas (Fim < Início)...');
  await page.locator('#form\\.espl_data_inicio').fill('20/09/2026');
  await page.locator('#form\\.espl_data_fim').fill('08/09/2026');
  await page.waitForTimeout(500);

  console.log('Tentando salvar com datas invertidas...');
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(2000);

  // Capturar erro de validação
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa datas invertidas escala.png' });
  console.log('✔ Print 02 - Recusa datas invertidas capturado com sucesso.');

  // 4. Corrigir datas: Início 08/09/2026, Fim 20/09/2026
  console.log('Corrigindo para datas válidas: 08/09/2026 a 20/09/2026...');
  await page.locator('#form\\.espl_data_inicio').fill('08/09/2026');
  await page.locator('#form\\.espl_data_fim').fill('20/09/2026');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Escala de plantao salva.png' });
  console.log('✔ Print 03 - Escala salva capturado.');

  // 5. Filtros na listagem de escalas
  console.log('Acessando listagem de escalas para validar filtros...');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Inspecionar se há botão de filtros
  const btnFiltro = page.locator('button[aria-label*="Filtros"], button:has-text("Filtros"), .fi-ta-filters-trigger').first();
  if (await btnFiltro.isVisible().catch(() => false)) {
    await btnFiltro.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-filtros-escala.png' });
  } else {
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-listagem-escala.png' });
  }
});
