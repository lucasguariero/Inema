const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('E2E: Módulo Fiscalização - DOR004 e DOR005.1 Integrados', () => {
  let urlDOR004;
  let urlDOR005;

  test.beforeAll(() => {
    const fileDOR004 = path.resolve(__dirname, '../../src/emergencia-quimica-externa.html');
    const fileDOR005 = path.resolve(__dirname, '../../src/consulta-externa.html');
    urlDOR004 = `file:///${fileDOR004.replace(/\\/g, '/')}`;
    urlDOR005 = `file:///${fileDOR005.replace(/\\/g, '/')}`;
  });

  test.beforeEach(async ({ page }) => {
    page.on('dialog', dialog => dialog.accept());
  });

  test('DOR004: Casca Global, Gov.br, regras de formulário e validações MSG001/002/003/004', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(urlDOR004);
    await page.setViewportSize({ width: 1400, height: 900 });

    // 1. Casca Global e Design System INEMA
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.getByText('Giovani Silva')).toBeVisible();
    await expect(page.getByText('Gov.br Ouro')).toBeVisible();
    await expect(page.locator('#badgeNumeroRE')).toHaveText('A gerar na finalização');

    // 2. Vínculo Empresarial (RN003 e RN004)
    // Inicialmente Não -> campos de empresa ocultos, select sem vínculo visível
    await expect(page.locator('#blocoVinculoNao')).toBeVisible();
    await expect(page.locator('#blocoVinculoSim')).toBeHidden();

    // Alternar para SIM -> exibe Empresa e Cargo (RN003)
    await page.locator('input[name="vinculoEmpresa"][value="SIM"]').check();
    await expect(page.locator('#blocoVinculoSim')).toBeVisible();
    await expect(page.locator('#blocoVinculoNao')).toBeHidden();

    // Alternar para NÃO -> testar Outras Instituições (RN004)
    await page.locator('input[name="vinculoEmpresa"][value="NÃO"]').check();
    await page.locator('#campoClassificacaoSemVinculo').selectOption('Outras instituições');
    await expect(page.locator('#blocoOutrasInstituicoes')).toBeVisible();

    // 3. Tipologias Químicas (RN027) e condicional Outros (RN028)
    const optionsTipos = await page.locator('#campoTipoEmergencia option').allTextContents();
    expect(optionsTipos.length).toBe(16); // 1 default + 15 catálogo oficial
    await page.locator('#campoTipoEmergencia').selectOption('Outros');
    await expect(page.locator('#blocoDescricaoOutros')).toBeVisible();

    // 4. Catálogo de 14 Áreas Atingidas e trava de máximo 3 (RN012, RN013)
    const checkboxesAreas = page.locator('#gridAreasAtingidas input[type="checkbox"]');
    expect(await checkboxesAreas.count()).toBe(14);

    // Selecionar 3 áreas: Urbana, Recurso Hídrico, Rodovia
    await page.locator('#gridAreasAtingidas label').filter({ hasText: 'Área Urbana' }).locator('input').check();
    await page.locator('#gridAreasAtingidas label').filter({ hasText: 'Recurso Hídrico' }).locator('input').check();
    await page.locator('#gridAreasAtingidas label').filter({ hasText: 'Rodovia' }).locator('input').check();
    await expect(page.locator('#badgeContagemAreas')).toHaveText('3 de 3 selecionadas');

    // 5. Coordenadas: ausentes inicialmente para disparar MSG002
    // Tentar finalizar com campos vazios -> MSG001
    await page.locator('#campoDescricao').fill('Teste emergência química automatizada.');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#modalMsg001')).toBeVisible();
    await page.locator('#modalMsg001 button').click();
    await expect(page.locator('#modalMsg001')).toBeHidden();

    // Preencher campos obrigatórios
    await page.locator('#campoClassificacaoSemVinculo').selectOption('Cidadão comum');
    await page.locator('#campoDataHoraConstatacao').fill('2026-09-09T10:30');
    await page.locator('#campoTipoEmergencia').selectOption('Acidente no transporte rodoviário de produtos químicos');
    await page.locator('#campoEndereco').fill('Rodovia BR-324, KM 580');
    await page.locator('#campoPontoReferencia').fill('Próximo ao viaduto de Simões Filho');

    // Finalizar sem coordenadas -> MSG002
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('#modalMsg002')).toBeVisible();

    // Clicar em Continuar no modal MSG002 -> abre confirmação definitiva MSG003
    await page.locator('#modalMsg002 button').filter({ hasText: 'Continuar' }).click();
    await expect(page.locator('#modalMsg003')).toBeVisible();

    // Clicar em SIM no modal MSG003 -> Sucesso MSG004
    await page.locator('#modalMsg003 button').filter({ hasText: 'Sim' }).click();
    await expect(page.locator('#modalMsg004')).toBeVisible();
    await expect(page.locator('#badgeStatusRE')).toHaveText('Emergência Registrada');

    // Pós-finalização: seção de relatórios regulatórios liberada
    await page.locator('#modalMsg004 button').filter({ hasText: 'Permanecer na Ocorrência' }).click();
    await expect(page.locator('#secaoRelatoriosPosFinalizacao')).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('DOR005.1: Filtros de consulta, regra RN004, visualização protegida e relatórios', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(urlDOR005);
    await page.setViewportSize({ width: 1400, height: 900 });

    // 1. Casca Global e Design System INEMA
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.locator('#tabelaRegistrosExternos')).toBeVisible();

    // 2. Filtro Condicional Tipo da Emergência Química (RN004)
    const selTipoEmerg = page.locator('#filtroTipoEmergencia');
    await expect(selTipoEmerg).toBeDisabled();

    // Ao selecionar Tipo de Registro = Emergência Química (RE) -> habilita
    await page.locator('#filtroTipoRegistro').selectOption('Emergência Química (RE)');
    await expect(selTipoEmerg).toBeEnabled();

    // Ao voltar para Todos -> desabilita novamente
    await page.locator('#filtroTipoRegistro').selectOption('Todos');
    await expect(selTipoEmerg).toBeDisabled();

    // 3. Validação de Datas (RN005 / MSG001 e MSG002)
    // Data inicial > Data final -> MSG001
    await page.locator('#filtroDataInicial').fill('2026-09-08');
    await page.locator('#filtroDataFinal').fill('2026-09-01');
    await page.locator('button[type="submit"]').filter({ hasText: 'Consultar' }).click();
    await expect(page.locator('#alertaFiltroDatas')).toBeVisible();
    await expect(page.locator('#textoAlertaFiltroDatas')).toContainText('A data inicial não pode ser posterior à data final');

    // Limpar filtros
    await page.locator('button').filter({ hasText: 'Limpar filtros' }).first().click();
    await expect(page.locator('#alertaFiltroDatas')).toBeHidden();

    // 4. Drawer de Visualização Protegida
    const btnVisualizar = page.locator('button[title*="Visualizar registro"]').first();
    await btnVisualizar.click();
    await expect(page.locator('#drawerVisualizacao')).toBeVisible();
    await expect(page.locator('#drawerTipoRotulo')).toBeVisible();

    // Alternar abas do drawer
    await page.locator('#tabDrawerRelatorios').click();
    await expect(page.locator('#conteudoAbasDrawer')).toBeVisible();

    await page.locator('#tabDrawerHistorico').click();
    await expect(page.locator('#conteudoAbasDrawer')).toBeVisible();

    // Fechar drawer
    await page.locator('button').filter({ hasText: 'Fechar Visualização' }).click();
    await expect(page.locator('#drawerVisualizacao')).toBeHidden();

    expect(errors).toHaveLength(0);
  });

  test('Estado Compartilhado: RE cadastrado no DOR004 surge no topo do DOR005.1', async ({ page }) => {
    // 1. Cadastrar RE no DOR004
    await page.goto(urlDOR004);
    await page.locator('input[name="vinculoEmpresa"][value="SIM"]').check();
    await page.locator('#campoNomeEmpresa').fill('Petroquímica Bahia Teste E2E');
    await page.locator('#campoCargo').fill('Supervisor Químico');
    await page.locator('#campoDataHoraConstatacao').fill('2026-09-09T11:00');
    await page.locator('#campoTipoEmergencia').selectOption('Acidente industrial em planta química ou petroquímica');
    await page.locator('#campoDescricao').fill('Teste de estado compartilhado entre DOR004 e DOR005.1.');
    await page.locator('#campoMunicipio').selectOption('Camaçari');
    await page.locator('#campoEndereco').fill('Rua do Polo, s/n');
    await page.locator('#campoPontoReferencia').fill('Bloco B, Polo Industrial');

    // Selecionar área
    await page.locator('#gridAreasAtingidas label').filter({ hasText: 'Área Industrial' }).locator('input').check();

    // Adicionar coordenada
    await page.locator('#inputCoordLatitude').fill('-12.7001');
    await page.locator('#inputCoordLongitude').fill('-38.3200');
    await page.locator('button').filter({ hasText: '+ Incluir' }).click();

    // Finalizar
    await page.locator('button[type="submit"]').click();
    // Modal MSG003 direto pois tem coordenadas
    await expect(page.locator('#modalMsg003')).toBeVisible();
    await page.locator('#modalMsg003 button').filter({ hasText: 'Sim' }).click();
    await expect(page.locator('#modalMsg004')).toBeVisible();

    const numeroREGerado = await page.locator('#badgeNumeroRE').innerText();
    expect(numeroREGerado).toContain('/INEMA/RE');

    // 2. Navegar para DOR005.1 e verificar se o RE aparece no topo com status "Emergência Registrada"
    await page.goto(urlDOR005);
    const primeiraLinhaNumero = await page.locator('#corpoTabelaRegistros tr:first-child td:first-child').innerText();
    expect(primeiraLinhaNumero).toContain(numeroREGerado);

    const primeiraLinhaStatus = await page.locator('#corpoTabelaRegistros tr:first-child td:nth-child(5)').innerText();
    expect(primeiraLinhaStatus).toContain('Emergência Registrada');
  });
});
