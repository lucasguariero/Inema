const { test, expect } = require('@playwright/test');

test('test Bloco 2 escala creation and validation', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- Acessando Cadastro de Escala ---');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Plantonista
  console.log('1. Selecionando Plantonista...');
  await page.locator('#form\\.espl_plan_id').click();
  await page.waitForTimeout(800);
  const bruno = page.locator('[role="option"]:has-text("Bruno Carvalho")').first();
  if (await bruno.isVisible()) {
    await bruno.click();
    console.log('Bruno selecionado');
  } else {
    await page.locator('[role="option"]').first().click();
  }
  await page.waitForTimeout(600);

  // 2. Municípios cobertos: Salvador
  console.log('2. Selecionando Município Salvador...');
  await page.locator('#form\\.municipios').click();
  await page.waitForTimeout(800);

  // No popover aberto, clicar na opção que contém Salvador
  // Pode usar o scroll do dropdown ou digitar
  const searchInput = page.locator('.fi-select-input-options-ctn input, [role="listbox"] input, input[placeholder*="digitar"]:visible').first();
  if (await searchInput.isVisible()) {
    console.log('Digitando Salvador na busca...');
    await searchInput.fill('Salvador');
    await page.waitForTimeout(1000);
  }

  // Clicar na opção Salvador
  const itemSalvador = page.locator('[role="option"]:has-text("Salvador"), .fi-select-input-option:has-text("Salvador")').first();
  if (await itemSalvador.isVisible()) {
    console.log('Clicando em Salvador...');
    await itemSalvador.click();
  } else {
    console.log('Procurando texto Salvador...');
    await page.getByText('Salvador', { exact: true }).first().click();
  }
  await page.waitForTimeout(600);

  // Pressionar Escape para fechar o combobox de municípios
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // 3. Teste datas invertidas
  console.log('3. Testando datas invertidas (Fim < Início)...');
  const inputInicio = page.locator('#form\\.espl_data_inicio');
  const inputFim = page.locator('#form\\.espl_data_fim');

  await inputInicio.fill('20/09/2026');
  await inputFim.fill('08/09/2026');
  await page.waitForTimeout(500);

  // Submeter para verificar recusa
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa datas invertidas escala.png' });
  console.log('✔ Print 02 - Recusa datas invertidas capturado!');

  // 4. Corrigir datas: 08/09/2026 a 20/09/2026
  console.log('4. Corrigindo para datas válidas (08/09/2026 a 20/09/2026)...');
  await inputInicio.fill('08/09/2026');
  await inputFim.fill('20/09/2026');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Escala de plantao salva.png' });
  console.log('✔ Print 03 - Escala de plantão salva capturado!');

  // 5. Filtros na listagem
  console.log('5. Testando filtros na listagem de escalas...');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Listagem escalas de plantao.png' });
  console.log('✔ Print 04 capturado.');
});
