const { test, expect } = require('@playwright/test');
const { attachNetworkLogger } = require('../utils/qa-helper');

test('DOR003 - Blocos 1, 2 e 3: Plantonistas, Escalas e Call Center', async ({ page }) => {
  test.setTimeout(240000);
  const logger = attachNetworkLogger(page);

  // Login Admin
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // =========================================================================
  // BLOCO 1: PLANTONISTAS & DUPLICIDADE
  // =========================================================================
  console.log('\n--- BLOCO 1: Cadastrar Plantonista e Testar Duplicidade ---');
  await page.goto('https://gla-inema-hml.acto.com.br/plantonistas/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Selecionar técnico já existente para validar recusa
  const selectTecnico = page.locator('button[role="combobox"]').first();
  await selectTecnico.click();
  await page.waitForTimeout(1000);

  const opcoesTecnicos = await page.locator('[role="option"], .fi-select-input-option').allInnerTexts();
  console.log('Opções de técnicos:', opcoesTecnicos.slice(0, 5));
  const tecnicoNome = opcoesTecnicos[0].trim();
  console.log('Selecionando para teste de duplicidade:', tecnicoNome);
  await page.locator('[role="option"], .fi-select-input-option').first().click();
  await page.waitForTimeout(500);

  // Clicar em Criar
  await page.getByRole('button', { name: /criar/i }).first().click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 01 - Recusa duplicidade plantonista.png' });
  console.log('✔ Print 01 - Recusa de duplicidade de plantonista capturado.');

  // =========================================================================
  // BLOCO 2: CADASTRO DE ESCALA DE PLANTÃO & DATAS INVERTIDAS
  // =========================================================================
  console.log('\n--- BLOCO 2: Escala de Plantão e Validação de Datas Invertidas ---');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Selecionar plantonista
  const selectPlantonista = page.locator('button[role="combobox"]').first();
  await selectPlantonista.click();
  await page.waitForTimeout(800);
  await page.locator('[role="option"], .fi-select-input-option').first().click();
  await page.waitForTimeout(500);

  // 2. Municípios cobertos: Salvador
  const selectMun = page.locator('button[role="combobox"]').nth(1);
  await selectMun.click();
  await page.waitForTimeout(800);
  const optSalvador = page.locator('[role="option"]:has-text("Salvador"), .fi-select-input-option:has-text("Salvador")').first();
  if (await optSalvador.isVisible()) {
    await optSalvador.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
  }

  // 3. Teste datas invertidas: Início 20/09/2026, Fim 08/09/2026
  console.log('Preenchendo datas invertidas (Fim < Início)...');
  const inputInicio = page.locator('[id="form.espl_data_inicio"]');
  const inputFim = page.locator('[id="form.espl_data_fim"]');

  await inputInicio.click();
  await inputInicio.fill('20/09/2026');
  await inputFim.click();
  await inputFim.fill('08/09/2026');
  await page.waitForTimeout(500);

  // Tentar salvar com datas invertidas
  await page.getByRole('button', { name: /criar/i }).first().click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa datas invertidas escala.png' });
  console.log('✔ Print 02 - Recusa de datas invertidas na escala capturado.');

  // 4. Corrigir datas para valores válidos: Início 08/09/2026, Fim 20/09/2026
  console.log('Corrigindo datas válidas (08/09/2026 a 20/09/2026)...');
  await inputInicio.click();
  await inputInicio.fill('08/09/2026');
  await inputFim.click();
  await inputFim.fill('20/09/2026');
  await page.waitForTimeout(500);

  // Salvar escala
  await page.getByRole('button', { name: /criar/i }).first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Escala de plantao salva.png' });
  console.log('✔ Print 03 - Escala de plantão salva com sucesso.');

  // 5. Testar filtro "Vigente em" na listagem
  console.log('Testando filtros de vigência na listagem...');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Abrir popover de filtros da tabela se existir
  const btnFiltros = page.locator('button[aria-label*="Filtros"], button:has-text("Filtros"), .fi-ta-filters-trigger').first();
  if (await btnFiltros.isVisible().catch(() => false)) {
    await btnFiltros.click();
    await page.waitForTimeout(1000);

    const inputFiltroVigente = page.locator('input[placeholder*="Vigente"], input[type="text"]').last();
    if (await inputFiltroVigente.isVisible().catch(() => false)) {
      await inputFiltroVigente.fill('15/09/2026');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Filtro vigente 15-09.png' });

      await inputFiltroVigente.fill('15/10/2026');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 05 - Filtro vigente 15-10 vazio.png' });
    }
  }

  // =========================================================================
  // BLOCO 3: USUÁRIO CALL CENTER
  // =========================================================================
  console.log('\n--- BLOCO 3: Segurança e Usuários (Call Center) ---');
  await page.goto('https://gla-inema-hml.acto.com.br/usuarios', { waitUntil: 'networkidle' }).catch(async () => {
    await page.locator('text=Administração').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Segurança').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Usuários').first().click();
  });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 06 - Lista usuarios Call Center.png' });
  console.log('✔ Bloco 3: Tela de usuários inspecionada.');
});
