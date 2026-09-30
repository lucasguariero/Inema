const { test } = require('@playwright/test');

test('test Bloco 2 escala creation', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Selecionar plantonista
  console.log('Selecionando plantonista...');
  await page.locator('#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  const plantonistas = await page.locator('[role="option"]').allInnerTexts();
  console.log('Plantonistas:', plantonistas);
  await page.locator('[role="option"]').first().click();
  await page.waitForTimeout(500);

  // 2. Municípios: clicar no combobox de municípios
  console.log('Selecionando município Salvador...');
  await page.locator('#form\\.municipios').click();
  await page.waitForTimeout(600);
  // Pode digitar no input de busca que abre
  const searchInput = page.locator('input[aria-label="filament-forms::components.select.search_label"]:visible, input[placeholder*="digitar"]:visible').first();
  if (await searchInput.isVisible().catch(() => false)) {
    console.log('Digitando Salvador na busca...');
    await searchInput.fill('Salvador');
    await page.waitForTimeout(800);
  }
  const optSalvador = page.locator('[role="option"]:has-text("Salvador")').first();
  if (await optSalvador.isVisible().catch(() => false)) {
    console.log('Clicando na opção Salvador...');
    await optSalvador.click();
    await page.waitForTimeout(500);
  } else {
    console.log('Opção Salvador visível? Tentando clicar na primeira opção do dropdown...');
    await page.locator('[role="option"]').first().click();
  }
  // Fechar dropdown
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 3. Teste datas invertidas: Início 20/09/2026, Fim 08/09/2026
  console.log('Testando datas invertidas...');
  const inputInicio = page.locator('#form\\.espl_data_inicio');
  const inputFim = page.locator('#form\\.espl_data_fim');

  await inputInicio.fill('20/09/2026');
  await inputFim.fill('08/09/2026');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-datas-preenchidas.png' });

  // Tentar submeter
  console.log('Clicando em Criar para verificar recusa...');
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa datas invertidas escala.png' });
  console.log('✔ Print 02 capturado.');

  // 4. Corrigir datas válidas: Início 08/09/2026, Fim 20/09/2026
  console.log('Corrigindo datas válidas...');
  await inputInicio.fill('08/09/2026');
  await inputFim.fill('20/09/2026');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Escala salva.png' });
  console.log('✔ Print 03 capturado.');
});
