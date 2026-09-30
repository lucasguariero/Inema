const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_refino_regulacao');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Acessando página com escopo=regulacao...');
    await page.goto('http://localhost:4173/?escopo=regulacao', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Aba Tramitações - Visão Registros
    console.log('Capturando 01_tramitacoes_geral_2024.png...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_tramitacoes_geral_2024.png'), fullPage: false });

    // 2. Visão Atividades por Técnico (NOUT selecionado - Médias visíveis)
    console.log('Navegando para Atividades por técnico...');
    const btnTecnicos = page.locator('button:has-text("Atividades por técnico")');
    if (await btnTecnicos.count() > 0) {
      await btnTecnicos.first().click();
      await page.waitForTimeout(600);
      console.log('Capturando 02_atividades_tecnico_nout_2024.png...');
      await page.screenshot({ path: path.join(screenshotsDir, '02_atividades_tecnico_nout_2024.png'), fullPage: false });

      // Alternar para CRAS para testar ocultação do bloco de médias
      try {
        console.log('Selecionando CRAS para testar regra condicional NOUT...');
        const selectUnidade = page.locator('select').filter({ hasText: 'NOUT' });
        if (await selectUnidade.count() > 0) {
          await selectUnidade.first().selectOption('CRAS', { timeout: 3000 });
          await page.waitForTimeout(500);
          console.log('Capturando 03_atividades_tecnico_cras_sem_medias.png...');
          await page.screenshot({ path: path.join(screenshotsDir, '03_atividades_tecnico_cras_sem_medias.png'), fullPage: false });
        }
      } catch (e) {
        console.warn('Aviso select CRAS:', e.message);
      }
    }

    // 3. Visão Anual DIRRE
    console.log('Navegando para Anual DIRRE...');
    const btnAnual = page.locator('button:has-text("Anual DIRRE")');
    if (await btnAnual.count() > 0) {
      await btnAnual.first().click();
      await page.waitForTimeout(600);
      console.log('Capturando 04_anual_dirre_2024_graficos.png...');
      await page.screenshot({ path: path.join(screenshotsDir, '04_anual_dirre_2024_graficos.png'), fullPage: false });
    }

    // 4. Aba Acompanhamento da Pauta
    console.log('Navegando para Aba Acompanhamento da pauta...');
    const tabPauta = page.locator('button:has-text("Acompanhamento da pauta")');
    await tabPauta.first().click();
    await page.waitForTimeout(800);
    console.log('Capturando 05_pauta_carimbo_e_filtros.png...');
    await page.screenshot({ path: path.join(screenshotsDir, '05_pauta_carimbo_e_filtros.png'), fullPage: false });

    // 5. Scroll na tabela da Pauta para ver processo sem tramitação e badges
    console.log('Capturando 06_pauta_tabela_e_badges.png...');
    await page.evaluate(() => window.scrollTo(0, 450));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotsDir, '06_pauta_tabela_e_badges.png'), fullPage: false });

    // 6. Clicar em Detalhar no processo FORM-00319 (pauta-003 sem tramitação)
    console.log('Localizando e detalhando processo sem tramitação (FORM-00319)...');
    const rowPauta3 = page.locator('tr:has-text("FORM-00319")');
    if (await rowPauta3.count() > 0) {
      const btnDetalharPauta3 = rowPauta3.locator('button:has-text("Detalhar")');
      await btnDetalharPauta3.click();
      await page.waitForTimeout(600);
      console.log('Capturando 07_drawer_resumo_sem_tramitacao.png...');
      await page.screenshot({ path: path.join(screenshotsDir, '07_drawer_resumo_sem_tramitacao.png'), fullPage: false });

      // Clicar em Ver detalhes completos para abrir o modal
      const btnVerCompletos = page.locator('button:has-text("Ver detalhes completos")');
      if (await btnVerCompletos.count() > 0) {
        await btnVerCompletos.click();
        await page.waitForTimeout(600);
        console.log('Capturando 08_modal_completo_sem_tramitacao_top.png...');
        await page.screenshot({ path: path.join(screenshotsDir, '08_modal_completo_sem_tramitacao_top.png'), fullPage: false });

        // Scroll dentro do modal para ver blocos 5, 6 e 7
        const modalBody = page.locator('div[role="dialog"] .overflow-y-auto').last();
        if (await modalBody.count() > 0) {
          await modalBody.evaluate((el) => el.scrollTo(0, 800));
          await page.waitForTimeout(500);
          console.log('Capturando 09_modal_completo_blocos5_6_7.png...');
          await page.screenshot({ path: path.join(screenshotsDir, '09_modal_completo_blocos5_6_7.png'), fullPage: false });
        }
      }
    }

    console.log('=== TODAS AS CAPTURAS DE VERIFICAÇÃO CONCLUÍDAS COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro durante a verificação:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main();
