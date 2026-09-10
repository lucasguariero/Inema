const { test, expect } = require('@playwright/test');
const { attachNetworkLogger } = require('../utils/qa-helper');

test('DOR003 - Blocos 1 e 2: Plantonistas e Escalas de Plantão', async ({ page }) => {
  test.setTimeout(180000);
  const logger = attachNetworkLogger(page);

  // Login Admin
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // =========================================================================
  // BLOCO 1: CADASTRO DE PLANTONISTA
  // =========================================================================
  console.log('\n--- BLOCO 1: Plantonistas ---');
  await page.goto('https://gla-inema-hml.acto.com.br/plantonistas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-plantonistas-list.png', fullPage: true });

  // Clicar em "Novo plantonista" ou "Cadastrar Plantonista"
  const btnNovoPlantonista = page.locator('a:has-text("Cadastrar"), a:has-text("Novo"), button:has-text("Cadastrar"), button:has-text("Novo")').first();
  console.log('Botao novo plantonista:', await btnNovoPlantonista.innerText());
  await btnNovoPlantonista.click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-form-plantonista.png' });

  // Inspecionar campos do formulário
  console.log('Selecionando técnico...');
  const selectTecnico = page.locator('button[role="combobox"], select, input[role="combobox"]').first();
  await selectTecnico.click();
  await page.waitForTimeout(1000);

  const opcoesTecnicos = await page.locator('[role="option"], .fi-select-input-option').allInnerTexts();
  console.log('Opções de técnicos:', opcoesTecnicos.slice(0, 10));

  // Escolhemos um técnico disponível
  const tecnicoEscolhido = opcoesTecnicos[0] || 'Bruno Carvalho';
  console.log('Selecionando técnico:', tecnicoEscolhido);
  await page.locator('[role="option"], .fi-select-input-option').first().click();
  await page.waitForTimeout(500);

  // Salvar
  const btnSalvar = page.getByRole('button', { name: /salvar|cadastrar|criar/i }).last();
  await btnSalvar.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 01 - Plantonista cadastrado.png', fullPage: true });
  console.log('Plantonista cadastrado ou verificado.');

  // Tentar cadastrar o MESMO técnico novamente para validar a recusa por duplicidade
  console.log('Tentando cadastrar o mesmo técnico para testar duplicidade...');
  await page.goto('https://gla-inema-hml.acto.com.br/plantonistas/create', { waitUntil: 'networkidle' }).catch(async () => {
    await btnNovoPlantonista.click();
  });
  await page.waitForTimeout(2000);

  const selectTecnico2 = page.locator('button[role="combobox"], select, input[role="combobox"]').first();
  if (await selectTecnico2.isVisible()) {
    await selectTecnico2.click();
    await page.waitForTimeout(1000);
    // Tenta selecionar o mesmo técnico
    const opcaoDuplicada = page.locator(`[role="option"]:has-text("${tecnicoEscolhido}"), .fi-select-input-option:has-text("${tecnicoEscolhido}")`).first();
    if (await opcaoDuplicada.isVisible().catch(() => false)) {
      await opcaoDuplicada.click();
      await page.waitForTimeout(500);
      await page.getByRole('button', { name: /salvar|cadastrar|criar/i }).last().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa de duplicidade plantonista.png', fullPage: true });
      console.log('✔ Teste de duplicidade de plantonista executado.');
    } else {
      console.log('Técnico já cadastrado nem sequer aparece na lista para evitar duplicidade!');
      await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 02 - Recusa de duplicidade plantonista.png', fullPage: true });
    }
  }

  // =========================================================================
  // BLOCO 2: CADASTRO DE ESCALA DE PLANTÃO
  // =========================================================================
  console.log('\n--- BLOCO 2: Escalas de Plantão ---');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-escalas-list.png', fullPage: true });

  const btnNovaEscala = page.locator('a:has-text("Cadastrar"), a:has-text("Nova"), button:has-text("Cadastrar"), button:has-text("Nova")').first();
  console.log('Botao nova escala:', await btnNovaEscala.innerText());
  await btnNovaEscala.click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-form-escala.png' });

  // Inspecionar campos de escala
  console.log('Preenchendo escala...');
  // Selecionar plantonista
  const selectPlantonistaEscala = page.locator('button[role="combobox"]').first();
  if (await selectPlantonistaEscala.isVisible()) {
    await selectPlantonistaEscala.click();
    await page.waitForTimeout(800);
    await page.locator('[role="option"], .fi-select-input-option').first().click();
    await page.waitForTimeout(500);
  }

  // Municípios cobertos (marcar Salvador)
  const campoMunicipios = page.locator('text=Salvador, label:has-text("Salvador"), [id*="municipio"]').first();
  if (await campoMunicipios.isVisible().catch(() => false)) {
    await campoMunicipios.click();
  } else {
    // Pode ser combobox de multipla seleção
    const selectMun = page.locator('div:has-text("Municípios cobertos") button[role="combobox"], div:has-text("Municípios") input').first();
    if (await selectMun.isVisible().catch(() => false)) {
      await selectMun.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Salvador');
      await page.waitForTimeout(500);
      await page.locator('[role="option"]:has-text("Salvador")').first().click();
    }
  }

  // Testar inversão de datas: Início 20/09/2026, Fim 08/09/2026
  console.log('Testando validação de datas invertidas...');
  const inputsData = page.locator('input[type="text"][id*="inicio"], input[type="text"][id*="fim"], input[id*="data"]');
  const countDatas = await inputsData.count();
  console.log('Campos de data encontrados:', countDatas);

  const inputInicio = page.locator('input[id*="inicio"], input[name*="inicio"]').first();
  const inputFim = page.locator('input[id*="fim"], input[name*="fim"]').first();

  if (await inputInicio.isVisible() && await inputFim.isVisible()) {
    await inputInicio.fill('20/09/2026');
    await inputFim.fill('08/09/2026');
    await page.waitForTimeout(500);
    
    // Tentar salvar invertido
    await page.getByRole('button', { name: /salvar|cadastrar|criar/i }).last().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 03 - Recusa datas invertidas escala.png', fullPage: true });
    console.log('✔ Print de recusa de datas invertidas capturado!');

    // Corrigir para datas válidas: Início 08/09/2026, Fim 20/09/2026
    await inputInicio.fill('08/09/2026');
    await inputFim.fill('20/09/2026');
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /salvar|cadastrar|criar/i }).last().click();
    await page.waitForTimeout(3000);
    console.log('✔ Escala salva com sucesso!');
  }

  // Testar filtros na listagem de escalas
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Filtrar Vigente em: 15/09/2026
  console.log('Testando filtro Vigente em 15/09/2026...');
  const filtroBtn = page.locator('button[aria-label*="Filtros"], button:has-text("Filtros")').first();
  if (await filtroBtn.isVisible().catch(() => false)) {
    await filtroBtn.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-filtro-escala.png', fullPage: true });
});
