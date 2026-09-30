const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function runPenteFino() {
  const printsDir = path.join(__dirname, '../qa/pente_fino_prints');
  if (!fs.existsSync(printsDir)) {
    fs.mkdirSync(printsDir, { recursive: true });
  }

  console.log('Iniciando Vite Preview para Auditoria Pente Fino UX/QA...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4185'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe',
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'desktop_1080p', width: 1920, height: 1080, isMobile: false },
    { name: 'laptop_768p', width: 1366, height: 768, isMobile: false },
    { name: 'tablet_768', width: 768, height: 1024, isMobile: true },
    { name: 'mobile_390', width: 390, height: 844, isMobile: true },
  ];

  const routes = [
    { name: '01_login', tela: 'login' },
    { name: '02_dashboard', tela: 'inicio' },
    { name: '03_pauta_processos', tela: 'tabela' },
    { name: '04_formulario_requerimento', tela: 'formulario' },
    { name: '05_enquadramento_dipre', tela: 'enquadramento' },
    { name: '06_cadastros_basicos', tela: 'cadastros-basicos' },
    { name: '07_parametrizacoes_master', tela: 'parametrizacao' },
    { name: '08_usuarios_roles', tela: 'usuarios-roles' },
    { name: '09_cras_fauna', tela: 'cras' },
    { name: '10_dtrp_residuos', tela: 'dtrp' },
    { name: '11_certidao_cnd', tela: 'certidao-debito' },
    { name: '12_parcelamento_dae', tela: 'parcelamento' },
    { name: '13_recursos_hidricos_cerh', tela: 'cerh' },
    { name: '14_dispensa_ansla', tela: 'ansla' },
    { name: '15_imoveis_cefir', tela: 'cefir' },
    { name: '16_sispass_criadores', tela: 'sispass' },
    { name: '17_roteiro_apresentacao', tela: 'apresentacao' },
  ];

  const auditReport = {
    evaluatedAt: new Date().toISOString(),
    viewportsAudited: viewports.map(v => `${v.name} (${v.width}x${v.height})`),
    findings: [],
    overflows: [],
    consoleErrors: [],
  };

  try {
    for (const vp of viewports) {
      console.log(`\n========================================`);
      console.log(`📱 Testando Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`========================================`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
      });

      const page = await context.newPage();

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const errText = `[${vp.name}] ${msg.text()}`;
          console.log('🔴 Console Error:', errText);
          auditReport.consoleErrors.push(errText);
        }
      });

      for (const r of routes) {
        const url = `http://localhost:4185/?rota=seia-v2&tela=${r.tela}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
          await page.waitForTimeout(500);

          // Verificar overflow horizontal indesejado
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
          if (bodyScrollWidth > bodyClientWidth + 5) {
            const overflowMsg = `Overflow horizontal detectado em [${r.name}] no ${vp.name}: scrollWidth=${bodyScrollWidth} > clientWidth=${bodyClientWidth}`;
            console.log(`⚠️ ${overflowMsg}`);
            auditReport.overflows.push({
              tela: r.name,
              viewport: vp.name,
              scrollWidth: bodyScrollWidth,
              clientWidth: bodyClientWidth,
            });
          }

          // Salvar print do mobile e do desktop 1080p para auditoria visual
          if (vp.name === 'mobile_390' || vp.name === 'desktop_1080p') {
            const fileName = `${vp.name}_${r.name}.png`;
            await page.screenshot({ path: path.join(printsDir, fileName) });
          }

          // No mobile, testar interação com botão de menu hamburguer
          if (vp.name === 'mobile_390' && r.name === '02_dashboard') {
            const menuBtn = page.locator('button[aria-label*="menu" i], header button').first();
            if (await menuBtn.isVisible()) {
              await menuBtn.click();
              await page.waitForTimeout(400);
              await page.screenshot({ path: path.join(printsDir, 'mobile_390_sidebar_aberta.png') });
              await page.keyboard.press('Escape');
              await page.waitForTimeout(300);
            }
          }

          console.log(`  ✓ ${r.name}`);
        } catch (pageErr) {
          console.error(`  ❌ Erro ao testar ${r.name} em ${vp.name}:`, pageErr.message);
          auditReport.findings.push({
            tela: r.name,
            viewport: vp.name,
            error: pageErr.message,
          });
        }
      }

      await context.close();
    }

    const reportPath = path.resolve(__dirname, '../qa/pente_fino_audit_results.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
    console.log(`\n🎉 Auditoria Pente Fino concluída! Relatório salvo em ${reportPath}`);

  } catch (err) {
    console.error('Erro global na auditoria:', err);
  } finally {
    try {
      await browser.close();
      if (server && server.pid) {
        require('child_process').execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: 'ignore' });
      }
    } catch (_) {}
    process.exit(0);
  }
}

runPenteFino();
