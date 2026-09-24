const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureMariaAuditPrints() {
  const printsDir = path.resolve(__dirname, '../cards/relatorios-regulacao-maria/prints');
  fs.mkdirSync(printsDir, { recursive: true });

  console.log('Iniciando captura em 1920x1080 no link exclusivo da analista Maria...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  const baseUrl = 'https://inema.acto.com.br/?analista=maria';

  try {
    // 1. Visão Inicial - Aba 1: Tramitações no período (Topo + Gráficos)
    console.log('1. Navegando para link da Maria e capturando Visão Inicial...');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 01 - Aba 1 Visao Geral Metricas e Graficos (1080p).png')
    });
    console.log('Salvo: Print 01');

    // 2. Aba 1: Tabela de Registros com Ação Detalhar
    console.log('2. Rolando até a Tabela de Registros...');
    const tableHeader = page.locator('text=Detalhamento dos Dados');
    await tableHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 02 - Aba 1 Tabela de Registros e Paginacao (1080p).png')
    });
    console.log('Salvo: Print 02');

    // 3. Modal "Sobre os dados"
    console.log('3. Abrindo Modal Sobre os dados...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.click('button:has-text("Sobre os dados")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 03 - Modal Sobre os Dados SEIA e Criterios (1080p).png')
    });
    console.log('Salvo: Print 03');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // 4. Modal de Filtros Avançados
    console.log('4. Abrindo Modal de Filtros...');
    await page.click('button:has-text("Filtros")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 04 - Modal de Filtros Avancados (1080p).png')
    });
    console.log('Salvo: Print 04');
    await page.click('button:has-text("Consultar")');
    await page.waitForTimeout(500);

    // 5. Nível 1: Drawer Lateral de Resumo Rápido
    console.log('5. Abrindo Drawer Lateral Nivel 1...');
    await tableHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const detalharBtn = page.locator('button:has-text("Detalhar")').first();
    await detalharBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 05 - Nivel 1 Drawer Lateral de Resumo Rapido (1080p).png')
    });
    console.log('Salvo: Print 05');

    // 6. Nível 2: Modal de Detalhes Completos (Topo: Identificação, Registro, Situação Atual)
    console.log('6. Abrindo Modal Nivel 2 Detalhes Completos...');
    await page.click('button:has-text("Ver detalhes completos")');
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 06 - Nivel 2 Detalhes 7 Blocos - Topo Identificacao e Situacao (1080p).png')
    });
    console.log('Salvo: Print 06');

    // 7. Nível 2: Rolagem Intermediária (Atos Vinculados e Histórico de Tramitação)
    console.log('7. Rolando Modal Nivel 2 (Atos e Tramitacao)...');
    const modalScrollable = page.locator('div[role="dialog"] .overflow-y-auto, div[role="dialog"]');
    await page.evaluate(() => {
      const scrollable = document.querySelector('div[role="dialog"] .overflow-y-auto');
      if (scrollable) scrollable.scrollTop = 380;
    });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 07 - Nivel 2 Detalhes 7 Blocos - Atos Vinculados e Tramitacao (1080p).png')
    });
    console.log('Salvo: Print 07');

    // 8. Nível 2: Rolagem Final (Comunicação Apartada e Tempos/Prazos)
    console.log('8. Rolando Modal Nivel 2 (Comunicacao e Tempos/Prazos)...');
    await page.evaluate(() => {
      const scrollable = document.querySelector('div[role="dialog"] .overflow-y-auto');
      if (scrollable) scrollable.scrollTop = 850;
    });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 08 - Nivel 2 Detalhes 7 Blocos - Comunicacao e Tempos Prazos (1080p).png')
    });
    console.log('Salvo: Print 08');
    await page.click('button:has-text("Concluir")');
    await page.waitForTimeout(600);

    // 9. Aba 1: Sub-aba Atividades por Técnico com Médias NOUT
    console.log('9. Abrindo Visao Atividades por Tecnico...');
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.click('button:has-text("Atividades por técnico")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 09 - Aba 1 Atividades por Tecnico e Medias NOUT (1080p).png')
    });
    console.log('Salvo: Print 09');

    // 10. Aba 1: Estado de contingência Média Indisponível
    console.log('10. Testando Estado Media Indisponivel...');
    await page.click('button:has-text("Testar: Cobertura não confirmada")');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(printsDir, 'Print 10 - Aba 1 Estado Contingencia Media Indisponivel (1080p).png')
    });
    console.log('Salvo: Print 10');

    // 11. Aba 1: Sub-aba Por Agrupamento
    console.log('11. Abrindo Visao Por Agrupamento...');
    await page.click('button:has-text("Por agrupamento")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 11 - Aba 1 Visao Por Agrupamento e Nota Distintos (1080p).png')
    });
    console.log('Salvo: Print 11');

    // 12. Aba 1: Sub-aba Anual DIRRE
    console.log('12. Abrindo Visao Anual DIRRE...');
    await page.click('button:has-text("Anual DIRRE")');
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 12 - Aba 1 Visao Anual DIRRE e Avisos Institucionais (1080p).png')
    });
    console.log('Salvo: Print 12');

    // 13. Aba 2: Acompanhamento da Pauta (Visão Geral)
    console.log('13. Alternando para Aba 2: Acompanhamento da pauta...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.click('button:has-text("Acompanhamento da pauta")');
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 13 - Aba 2 Acompanhamento da Pauta Visao Geral (1080p).png')
    });
    console.log('Salvo: Print 13');

    // 14. Aba 2: Tabela de Pauta com Casos de Contraste Canônicos
    console.log('14. Rolando para Tabela da Pauta...');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(printsDir, 'Print 14 - Aba 2 Tabela Pauta Casos de Contraste Canonicos (1080p).png')
    });
    console.log('Salvo: Print 14');

    // 15. Aba 2: Drawer Nível 1 a partir da Pauta (sem inventar registro selecionado)
    console.log('15. Abrindo Drawer Nivel 1 da Pauta...');
    const detalharPautaBtn = page.locator('button:has-text("Detalhar")').first();
    await detalharPautaBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(printsDir, 'Print 15 - Aba 2 Drawer Nivel 1 Contextualizado da Pauta (1080p).png')
    });
    console.log('Salvo: Print 15');

    console.log('TODAS AS 15 CAPTURAS EM 1080p FORAM SALVAS COM SUCESSO!');
  } catch (err) {
    console.error('Erro durante captura:', err);
  } finally {
    await browser.close();
  }
}

captureMariaAuditPrints();
