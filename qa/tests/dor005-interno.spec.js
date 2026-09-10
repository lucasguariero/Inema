const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('DOR005: Consulta de Registros Internos (DIFIS)', () => {
  const filePath = path.resolve(__dirname, '../../src/consulta-interna.html');
  const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;

  test('Deve carregar a tela, exibir o indicador de emergências e filtros oficiais', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width: 1400, height: 900 });

    // Header institucional
    await expect(page.locator('header')).toContainText('SEIA');
    await expect(page.locator('header')).toContainText('Módulo Fiscalização');

    // Título e indicador de emergências (RN011 / LEG012)
    await expect(page.locator('h1')).toHaveText('Consultar Registros');
    const indicador = page.locator('#indicadorEmergenciasContainer');
    await expect(indicador).toBeVisible();
    await expect(page.locator('#contadorEmergencias')).toBeVisible();

    // Filtros
    await expect(page.locator('#filtroStatus')).toBeVisible();
    await expect(page.locator('#filtroTipoRegistro')).toBeVisible();
    await expect(page.locator('#filtroTipoEmergencia')).toBeDisabled(); // RN004: desabilitado inicialmente

    // Alternar para RE habilita o tipo da emergência
    await page.selectOption('#filtroTipoRegistro', 'Emergência Química (RE)');
    await expect(page.locator('#filtroTipoEmergencia')).toBeEnabled();

    // Totalizador e tabela
    await expect(page.locator('#totalRegistrosTexto')).toBeVisible();
    const linhas = page.locator('#tabelaRegistrosCorpo tr');
    const totalLinhas = await linhas.count();
    expect(totalLinhas).toBeGreaterThan(0);

    // Validação de período inválido (RN005 / MSG001)
    await page.fill('#filtroDataInicio', '2026-09-10');
    await page.fill('#filtroDataFim', '2026-09-01');
    await page.locator('button:has-text("Consultar")').first().click();
    await expect(page.locator('#alertaPeriodo')).toBeVisible();
    await expect(page.locator('#alertaPeriodoTexto')).toContainText('A data inicial não pode ser posterior à data final');

    // Limpar filtros (RN018)
    await page.locator('button:has-text("Limpar filtros")').first().click();
    await expect(page.locator('#alertaPeriodo')).toBeHidden();
    await expect(page.locator('#filtroTipoEmergencia')).toBeDisabled();

    // Abertura do Drawer de Visualização (BOT003 / RN012)
    const btnVisualizar = page.locator('#tabelaRegistrosCorpo button[title*="Visualizar"]').first();
    await btnVisualizar.click();
    await expect(page.locator('#drawerVisualizacao')).toBeVisible();
    await expect(page.locator('#btnTabGeral')).toBeVisible();
    await expect(page.locator('#btnTabComunicante')).toBeVisible();
    await expect(page.locator('#btnTabEquipe')).toBeVisible();
    await expect(page.locator('#btnTabRelatorios')).toBeVisible();
    await expect(page.locator('#btnTabHistorico')).toBeVisible();

    // Alternar aba para Histórico
    await page.locator('#btnTabHistorico').click();
    await expect(page.locator('#tabHistorico')).toBeVisible();

    // Fechar Drawer
    await page.locator('button:has-text("Fechar")').click();
    await expect(page.locator('#drawerVisualizacao')).toHaveClass(/translate-x-full/);

    expect(pageErrors).toHaveLength(0);
  });
});
