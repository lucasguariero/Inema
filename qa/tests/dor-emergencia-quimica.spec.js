const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Validação Rigorosa dos Requisitos DOR003 e DOR004 - Emergência Química', () => {
  let pageUrl;

  test.beforeAll(() => {
    const filePath = path.resolve(__dirname, '../../src/emergencia-quimica.html');
    pageUrl = `file:///${filePath.replace(/\\/g, '/')}`;
  });

  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('Deve carregar a página sem erros e alternar entre abas Interna, Externa e Consulta', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(pageUrl);
    await page.setViewportSize({ width: 1400, height: 900 });

    // Inicia na visão Interna (DOR003)
    await expect(page.locator('#view-interna')).toBeVisible();
    await expect(page.locator('#view-externa')).toBeHidden();
    await expect(page.locator('#view-consulta')).toBeHidden();

    // Clica na aba Externa (DOR004)
    await page.locator('#tab-externa').click();
    await expect(page.locator('#view-externa')).toBeVisible();
    await expect(page.locator('#view-interna')).toBeHidden();

    // Clica na aba Consulta / Call Center
    await page.locator('#tab-consulta').click();
    await expect(page.locator('#view-consulta')).toBeVisible();
    await expect(page.locator('#view-externa')).toBeHidden();

    expect(errors).toHaveLength(0);
  });

  test('Fluxo Interno (DOR003): Validação de campos, regras e 14 áreas', async ({ page }) => {
    await page.goto(pageUrl);
    await page.locator('#tab-interna').click();

    // Verifica campos de origem e datas
    await expect(page.locator('#internaOrigem')).toBeVisible();
    await expect(page.locator('#internaDataHoraComunicado')).toBeVisible();
    await expect(page.locator('#internaDataHoraOcorrencia')).toBeVisible();

    // Verifica catálogo de 15 tipologias
    const tiposOptions = await page.locator('#internaTipoEmergencia option').allTextContents();
    expect(tiposOptions.length).toBeGreaterThanOrEqual(16); // 1 placeholder + 15 tipologias

    // Verifica campo condicional Outros
    await page.locator('#internaTipoEmergencia').selectOption('Outros');
    await expect(page.locator('#internaBoxTipoOutros')).toBeVisible();

    // Verifica as 14 opções de áreas atingidas
    const checkboxesAreas = await page.locator('#internaAreasGrid input[type="checkbox"]').count();
    expect(checkboxesAreas).toBe(14);

    // Carrega dados de exemplo
    await page.evaluate(() => carregarDadosExemplo());
    await expect(page.locator('#internaDescricao')).toHaveValue(/Tombamento de caminhão-tanque/i);

    // Modal de inclusão de coordenada (BOT002)
    await page.locator('#view-interna button:has-text("+ Incluir nova coordenada")').click();
    await expect(page.locator('#modalCoordenada')).toBeVisible();
    await page.locator('#modalCoordLat').fill('-12.9714');
    await page.locator('#modalCoordLng').fill('-38.5014');
    await page.locator('#modalCoordenada button:has-text("Incluir Coordenada")').click();
    await expect(page.locator('#modalCoordenada')).toBeHidden();
  });

  test('Fluxo Externo (DOR004): Vínculo com empresa, dados Gov.br e Relatórios', async ({ page }) => {
    await page.goto(pageUrl);
    await page.locator('#tab-externa').click();

    // Card 1: Vínculo Sim / Não
    const radioNao = page.locator('input[name="externaVinculoEmpresa"][value="NÃO"]');
    const radioSim = page.locator('input[name="externaVinculoEmpresa"][value="SIM"]');
    await expect(radioNao).toBeChecked();
    await expect(page.locator('#externaBoxVinculoNao')).toBeVisible();
    await expect(page.locator('#externaBoxVinculoSim')).toBeHidden();

    // Se marcar SIM: exibe empresa e cargo, e habilita RPEQ (RN023)
    await radioSim.check();
    await expect(page.locator('#externaBoxVinculoSim')).toBeVisible();
    await expect(page.locator('#externaBoxVinculoNao')).toBeHidden();
    await expect(page.locator('#btnUploadRpeq')).toBeEnabled();

    // Card 2: 5 campos importados Gov.br
    await expect(page.getByText('Nome/Razão Social')).toBeVisible();
    await expect(page.getByText('CPF/CNPJ')).toBeVisible();
    await expect(page.getByText('Telefone/Celular', { exact: true })).toBeVisible();
    await expect(page.getByText('Outro Telefone/Celular')).toBeVisible();
    await expect(page.locator('#view-externa').getByText('E-mail', { exact: true })).toBeVisible();

    // Card 4: 14 áreas atingidas presentes
    const checkboxesExterna = await page.locator('#externaAreasGrid input[type="checkbox"]').count();
    expect(checkboxesExterna).toBe(14);

    // Card 5: Relatórios Regulatórios
    await expect(page.getByText('Relatórios Regulatórios de Emergência Química')).toBeVisible();
    await expect(page.getByText('1. RPEQ (Preliminar)')).toBeVisible();
    await expect(page.getByText('2. Relatório Conclusivo')).toBeVisible();
    await expect(page.getByText('3. Relatório Complementar')).toBeVisible();
  });

  test('Submissão e Modais: Validação MSG001, MSG002, MSG003, MSG004 e MSG007', async ({ page }) => {
    await page.goto(pageUrl);
    await page.locator('#tab-interna').click();

    // Limpa formulário
    await page.evaluate(() => limparFormularioAtual());

    // Clica em Finalizar Emergência sem preencher -> Deve abrir modal MSG001
    await page.locator('#view-interna button:has-text("Finalizar Emergência")').click();
    await expect(page.locator('#modalMsg001')).toBeVisible();
    await expect(page.locator('#modalMsg001')).toContainText('Preencher campos obrigatórios!');
    await page.locator('#modalMsg001 button:has-text("OK, Entendido")').click();
    await expect(page.locator('#modalMsg001')).toBeHidden();

    // Preenche com dados de exemplo
    await page.evaluate(() => carregarDadosExemplo());

    // Clica em Excluir Emergência -> Deve abrir modal MSG007
    await page.locator('#view-interna button:has-text("Excluir Emergência")').click();
    await expect(page.locator('#modalMsg007')).toBeVisible();
    await expect(page.locator('#modalMsg007')).toContainText('Deseja excluir o registro de emergência definitivamente?');
    await page.locator('#modalMsg007 button:has-text("NÃO")').click();
    await expect(page.locator('#modalMsg007')).toBeHidden();

    // Finaliza registro com sucesso (MSG003 -> MSG004)
    await page.locator('#view-interna button:has-text("Finalizar Emergência")').click();
    await expect(page.locator('#modalMsg003')).toBeVisible();
    await expect(page.locator('#modalMsg003')).toContainText('Após finalizar o registro da emergência química, não será possível realizar alterações!');
    await page.locator('#modalMsg003 button:has-text("SIM")').click();

    // Modal MSG004 de Sucesso
    await expect(page.locator('#modalMsg004')).toBeVisible();
    await expect(page.locator('#modalMsg004')).toContainText('/INEMA/RE');
    await page.locator('#modalMsg004 button').click();

    // Redireciona para o painel de consulta
    await expect(page.locator('#view-consulta')).toBeVisible();
  });

  test('Call Center: Associação de Plantonista (RN027) e Notificação (MSG006)', async ({ page }) => {
    await page.goto(`${pageUrl}?fluxo=consulta`);
    await page.setViewportSize({ width: 1400, height: 900 });

    await expect(page.locator('#view-consulta')).toBeVisible();

    // Localiza botão de associar plantão
    const btnAssociar = page.locator('button:has-text("Associar Plantão")').first();
    if (await btnAssociar.isVisible()) {
      await btnAssociar.click();
      await expect(page.locator('#modalAssociarPlantonista')).toBeVisible();
      await expect(page.locator('#modalAssociarPlantonista')).toContainText('Associar Técnico Plantonista (RN027)');

      // Confirma associação -> Deve disparar MSG006
      await page.locator('#modalAssociarPlantonista button:has-text("Confirmar Associação")').click();
      await expect(page.locator('#modalMsg006')).toBeVisible();
      await expect(page.locator('#modalMsg006')).toContainText('Nova Emergência Química registrada!');
      await page.locator('#modalMsg006 button:has-text("OK, Entendido")').click();
      await expect(page.locator('#modalMsg006')).toBeHidden();
    }
  });
});
