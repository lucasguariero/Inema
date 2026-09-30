const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const outputDir = path.resolve(__dirname, '../prints_inema_legado_4k_16x9');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Iniciando navegador Playwright (viewport 1920x1080 @ 2x -> 3840x2160 4K UHD 16:9)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const baseUrl = 'https://inema.acto.com.br';

  try {
    // -------------------------------------------------------------
    // CATEGORIA 1: MÓDULO FISCALIZAÇÃO (DIFIS & PLANTONISTAS)
    // -------------------------------------------------------------
    console.log('\n--- Categoria 1: Módulo Fiscalização ---');

    // 01. Denúncia Interna (Atendente)
    console.log('01. Capturando Denúncia Interna...');
    await page.goto(`${baseUrl}/?rota=atendente`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '01_fiscalizacao_denuncia_interna.png') });

    // 02. Formulário Cidadão (Denúncia Externa)
    console.log('02. Capturando Formulário Cidadão...');
    await page.goto(`${baseUrl}/?rota=cidadao`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '02_fiscalizacao_formulario_cidadao.png') });

    // 03. Emergência Química Interna
    console.log('03. Capturando Emergência Química Interna...');
    await page.goto(`${baseUrl}/?rota=emergencia-interna`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '03_fiscalizacao_emergencia_quimica_interna.png') });

    // 04. Emergência Química Externa
    console.log('04. Capturando Emergência Química Externa...');
    await page.goto(`${baseUrl}/?rota=emergencia-externa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '04_fiscalizacao_emergencia_quimica_externa.png') });

    // 05. Painel Interno DIFIS (Consulta Interna)
    console.log('05. Capturando Painel Interno DIFIS...');
    await page.goto(`${baseUrl}/?rota=consulta-interna`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '05_fiscalizacao_painel_interno_difis.png') });

    // 06. Consulta Cidadão (Consulta Externa)
    console.log('06. Capturando Consulta Cidadão...');
    await page.goto(`${baseUrl}/?rota=consulta-externa`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '06_fiscalizacao_consulta_cidadao.png') });

    // 07. Cadastro de Plantonista (DOR006)
    console.log('07. Capturando Cadastro de Plantonista...');
    await page.goto(`${baseUrl}/?rota=fisc-plantonista`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '07_fiscalizacao_cadastro_plantonista_dor006.png') });

    // 08. Escala de Plantonistas (DOR007)
    console.log('08. Capturando Escala de Plantonistas...');
    await page.goto(`${baseUrl}/?rota=fisc-escala`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outputDir, '08_fiscalizacao_escala_plantonistas_dor007.png') });


    // -------------------------------------------------------------
    // CATEGORIA 2: RELATÓRIOS GERENCIAIS & REGULAÇÃO (MARIA)
    // -------------------------------------------------------------
    console.log('\n--- Categoria 2: Relatórios Gerenciais & Regulação (Maria) ---');

    // 09. Dashboard Gerencial da Regulação
    console.log('09. Capturando Dashboard Gerencial da Regulação...');
    await page.goto(`${baseUrl}/?rota=dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '09_relatorios_gerenciais_dashboard.png') });

    // 10. Relatórios de Regulação SEIA - Tramitações no Período (Aba 1)
    console.log('10. Capturando Relatórios de Regulação - Tramitações no Período...');
    await page.goto(`${baseUrl}/?rota=relatorios`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '10_regulacao_tramitacoes_periodo_maria.png') });

    // 11. Relatórios de Regulação SEIA - Atividades por Técnico (NOUT)
    console.log('11. Capturando Atividades por Técnico (NOUT)...');
    const btnTecnicos = page.locator('button:has-text("Atividades por técnico")').first();
    if (await btnTecnicos.count() > 0) {
      await btnTecnicos.click();
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 480));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outputDir, '11_regulacao_atividades_tecnico_nout.png') });
    }

    // 12. Relatórios de Regulação SEIA - Anual DIRRE
    console.log('12. Capturando Anual DIRRE...');
    const btnAnual = page.locator('button:has-text("Anual DIRRE")').first();
    if (await btnAnual.count() > 0) {
      await btnAnual.click();
      await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 520));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(outputDir, '12_regulacao_anual_dirre.png') });
    }

    // 13. Relatórios de Regulação SEIA - Acompanhamento da Pauta (Aba 2)
    console.log('13. Capturando Acompanhamento da Pauta...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const tabPauta = page.locator('button:has-text("Acompanhamento da pauta")').first();
    if (await tabPauta.count() > 0) {
      await tabPauta.click();
      await page.waitForTimeout(1000);
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outputDir, '13_regulacao_acompanhamento_pauta.png') });
    }


    // -------------------------------------------------------------
    // CATEGORIA 3: UNIDADES DE CONSERVAÇÃO - CEUC (HÉRIKLES)
    // -------------------------------------------------------------
    console.log('\n--- Categoria 3: Unidades de Conservação - CEUC (Hérikles) ---');

    // 14. CEUC - Pauta e Consulta de UCs (TL001)
    console.log('14. Capturando CEUC Consulta e Pauta (TL001)...');
    await page.goto(`${baseUrl}/?rota=ceuc`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '14_ceuc_consulta_pauta_ucs_herikles.png') });

    // 15. CEUC - Formulário Nova UC (TL002)
    console.log('15. Capturando Formulário Nova UC (TL002)...');
    const btnNovaUc = page.locator('button:has-text("+ Nova UC"), button:has-text("Nova UC")').first();
    if (await btnNovaUc.count() > 0) {
      await btnNovaUc.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(outputDir, '15_ceuc_formulario_nova_uc_tl002.png') });
    }


    // -------------------------------------------------------------
    // CATEGORIA 4: UNIDADES DE CONSERVAÇÃO - DEMANDAS NAIANE
    // -------------------------------------------------------------
    console.log('\n--- Categoria 4: Unidades de Conservação - Demandas Naiane (DOR001 a DOR004) ---');

    // 16. Agendamento de Visitação (DOR001)
    console.log('16. Capturando Agendamento de Visitação (DOR001)...');
    await page.goto(`${baseUrl}/?rota=uc-agendamento`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '16_uc_agendamento_visitacao_dor001_naiane.png') });

    // 17. Autorização de Visitação e Eventos - AAV (DOR002)
    console.log('17. Capturando Autorização de Eventos - AAV (DOR002)...');
    await page.goto(`${baseUrl}/?rota=uc-autorizacao-visitacao`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '17_uc_autorizacao_eventos_aav_dor002_naiane.png') });

    // 18. Atividades Didáticas - AAD (DOR003)
    console.log('18. Capturando Atividades Didáticas - AAD (DOR003)...');
    await page.goto(`${baseUrl}/?rota=uc-atividades-didaticas`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '18_uc_atividades_didaticas_aad_dor003_naiane.png') });

    // 19. Pesquisa Científica - Pesc (DOR004)
    console.log('19. Capturando Pesquisa Científica - Pesc (DOR004)...');
    await page.goto(`${baseUrl}/?rota=uc-pesquisa-cientifica`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '19_uc_pesquisa_cientifica_pesc_dor004_naiane.png') });


    // -------------------------------------------------------------
    // CATEGORIA 5: SEIA PLATAFORMA (HÍBRIDO)
    // -------------------------------------------------------------
    console.log('\n--- Categoria 5: SEIA Plataforma (Híbrido) ---');

    // 20. Central SEIA (Home)
    console.log('20. Capturando Central SEIA Home...');
    await page.goto(`${baseUrl}/?rota=seia-home`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '20_seia_central_gestao_home.png') });

    // 21. Gestão de DAEs
    console.log('21. Capturando Gestão de DAEs...');
    await page.goto(`${baseUrl}/?rota=seia-daes`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outputDir, '21_seia_gestao_daes.png') });

    console.log('\n=== TODAS AS 21 CAPTURAS EM 4K (3840x2160, 16:9) FORAM CONCLUÍDAS COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro durante captura:', err);
  } finally {
    await browser.close();
  }
}

main();
