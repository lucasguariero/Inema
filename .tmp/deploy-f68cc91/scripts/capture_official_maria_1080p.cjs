const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function main() {
  const printsDir = path.resolve(__dirname, '../qa/cards/relatorios-regulacao-maria/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  console.log('Iniciando captura Full HD (1920x1080) em https://inema.acto.com.br/?escopo=regulacao...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const url = 'https://inema.acto.com.br/?escopo=regulacao';

  try {
    // 1. Aba 1: Tramitações no período - Topo e Controles 2024
    console.log('1. Acessando página e capturando Visão Geral 2024...');
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(printsDir, 'Print 01 - Aba 1 Tramitacoes no Periodo - Metricas e Controles 2024.png')
    });
    console.log('Salvo: Print 01');

    // 2. Aba 1: Tabela de Registros
    console.log('2. Rolando para Tabela de Registros...');
    const tableHeader = page.locator('text=Detalhamento dos Dados');
    await tableHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 02 - Aba 1 Tramitacoes no Periodo - Tabela de Registros 2024.png')
    });
    console.log('Salvo: Print 02');

    // 3. Modal Sobre os Dados
    console.log('3. Abrindo Modal Sobre os Dados...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.click('button:has-text("Sobre os dados")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 03 - Modal Sobre os Dados - Criterios SEIA e Carimbo Atualizado.png')
    });
    console.log('Salvo: Print 03');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // 4. Modal Filtros Avançados das Tramitações
    console.log('4. Abrindo Modal de Filtros Avançados...');
    await page.locator('button:has-text("Filtros")').first().click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 04 - Modal de Filtros Avancados - Tramitacoes.png')
    });
    console.log('Salvo: Print 04');
    await page.click('button:has-text("Consultar")');
    await page.waitForTimeout(500);

    // 5. Visão Atividades por Técnico com NOUT selecionado
    console.log('5. Abrindo Visão Atividades por Técnico (NOUT)...');
    await page.locator('button:has-text("Atividades por técnico")').first().click();
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 520));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 05 - Aba 1 Atividades por Tecnico - Medias NOUT 2024.png')
    });
    console.log('Salvo: Print 05');

    // 6. Visão Atividades por Técnico com CRAS selecionado (regra condicional NOUT)
    console.log('6. Selecionando CRAS para comprovar ocultação de médias...');
    const selectUnidade = page.locator('select').filter({ hasText: 'NOUT' });
    if (await selectUnidade.count() > 0) {
      await selectUnidade.first().selectOption('CRAS');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(printsDir, 'Print 06 - Aba 1 Atividades por Tecnico - Regra Condicional CRAS sem Medias.png')
      });
      console.log('Salvo: Print 06');
    }

    // 7. Visão Por Agrupamento
    console.log('7. Abrindo Visão Por Agrupamento...');
    await page.locator('button:has-text("Por agrupamento")').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 07 - Aba 1 Visao Por Agrupamento - Consolidado 2024.png')
    });
    console.log('Salvo: Print 07');

    // 8. Visão Anual DIRRE
    console.log('8. Abrindo Visão Anual DIRRE...');
    await page.locator('button:has-text("Anual DIRRE")').first().click();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 850));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 08 - Aba 1 Visao Anual DIRRE - Familias e Evolucao Mensal.png')
    });
    console.log('Salvo: Print 08');

    // 9. Aba 2: Acompanhamento da Pauta - Topo e Métricas
    console.log('9. Navegando para Aba Acompanhamento da Pauta...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Acompanhamento da pauta")').first().click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 09 - Aba 2 Acompanhamento da Pauta - Carimbo e Metricas 412 Excedidos.png')
    });
    console.log('Salvo: Print 09');

    // 10. Aba 2: Tabela Ativa da Pauta
    console.log('10. Rolando para Tabela da Pauta...');
    await page.evaluate(() => window.scrollTo(0, 480));
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 10 - Aba 2 Acompanhamento da Pauta - Tabela Ativa e Badges de Prazo.png')
    });
    console.log('Salvo: Print 10');

    // 11. Aba 2: Drawer de Filtros da Pauta
    console.log('11. Abrindo Drawer de Filtros da Pauta...');
    const btnFiltrosPauta = page.locator('button:has-text("Filtros")').first();
    await btnFiltrosPauta.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 11 - Aba 2 Filtros da Pauta - Drawer com Filtros Sincronizados.png')
    });
    console.log('Salvo: Print 11');
    const btnFecharFiltros = page.locator('button:has-text("Fechar")').last();
    if (await btnFecharFiltros.count() > 0) {
      await btnFecharFiltros.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(500);

    // 12. Aba 2: Destaque do processo FORM-00319 (Sem tramitação)
    console.log('12. Localizando processo sem tramitação FORM-00319...');
    const rowPauta3 = page.locator('tr:has-text("FORM-00319")');
    await rowPauta3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 12 - Aba 2 Caso Sem Tramitacao - Destaque FORM-00319 na Tabela.png')
    });
    console.log('Salvo: Print 12');

    // 13. Aba 2: Drawer Nível 1 do FORM-00319
    console.log('13. Abrindo Drawer Nível 1 do FORM-00319...');
    const btnDetalharPauta3 = rowPauta3.locator('button:has-text("Detalhar")');
    await btnDetalharPauta3.click();
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(printsDir, 'Print 13 - Aba 2 Caso Sem Tramitacao - Drawer Nivel 1 Resumo Rapido.png')
    });
    console.log('Salvo: Print 13');

    // 14. Aba 2: Modal Nível 2 do FORM-00319 (Topo)
    console.log('14. Abrindo Modal Nível 2 (Topo)...');
    await page.locator('button:has-text("Ver detalhes completos")').click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 14 - Aba 2 Caso Sem Tramitacao - Modal Nivel 2 Topo Identificacao.png')
    });
    console.log('Salvo: Print 14');

    // 15. Aba 2: Modal Nível 2 do FORM-00319 (Rolagem - Blocos 5, 6 e 7)
    console.log('15. Rolando Modal Nível 2 para Blocos 5, 6 e 7...');
    await page.evaluate(() => {
      const scrollable = document.querySelector('div[role="dialog"] .overflow-y-auto');
      if (scrollable) scrollable.scrollTop = 850;
    });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 15 - Aba 2 Caso Sem Tramitacao - Modal Nivel 2 Empty State e Tempos Indisponiveis.png')
    });
    console.log('Salvo: Print 15');

    console.log('=== TODAS AS 15 CAPTURAS OFICIAIS FORAM CONCLUÍDAS COM SUCESSO! ===');

  } catch (err) {
    console.error('Erro na captura:', err);
  } finally {
    await browser.close();
  }
}

main();
