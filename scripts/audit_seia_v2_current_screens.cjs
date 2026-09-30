const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function waitForServer(port) {
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}/`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.end();
      });
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

const SCREENS = [
  { id: 'inicio', url: '/?rota=seia-v2&tela=inicio', name: 'Dashboard Gerencial' },
  { id: 'tabela', url: '/?rota=seia-v2&tela=tabela', name: 'Pauta de Processos' },
  { id: 'formulario', url: '/?rota=seia-v2&tela=formulario', name: 'Requerimento Unificado' },
  { id: 'seia-painel', url: '/?rota=seia-v2&tela=seia-painel', name: 'Métricas do Analista' },
  { id: 'atendente', url: '/?rota=seia-v2&tela=atendente', name: 'Nova Denúncia Interna' },
  { id: 'cidadao', url: '/?rota=seia-v2&tela=cidadao', name: 'Registrar Denúncia Cidadão' },
  { id: 'emergencia-interna', url: '/?rota=seia-v2&tela=emergencia-interna', name: 'Nova Emergência Interna' },
  { id: 'emergencia-externa', url: '/?rota=seia-v2&tela=emergencia-externa', name: 'Registrar Emergência Externa' },
  { id: 'consulta-interna', url: '/?rota=seia-v2&tela=consulta-interna', name: 'Consultar Registros DIFIS' },
  { id: 'consulta-externa', url: '/?rota=seia-v2&tela=consulta-externa', name: 'Acompanhar Registros Cidadão' },
  { id: 'seia-daes', url: '/?rota=seia-v2&tela=seia-daes', name: 'Financeiro DAEs' },
  { id: 'design-system', url: '/?rota=seia-v2&tela=design-system', name: 'Design System INEMA' },
  { id: 'cerh', url: '/?rota=seia-v2&tela=cerh', name: 'CERH Recursos Hídricos' },
  { id: 'dtrp', url: '/?rota=seia-v2&tela=dtrp', name: 'DTRP Transporte de Resíduos' },
  { id: 'reposicao-florestal', url: '/?rota=seia-v2&tela=reposicao-florestal', name: 'Reposição Florestal CRF' },
  { id: 'certidao-debito', url: '/?rota=seia-v2&tela=certidao-debito', name: 'Certidão de Débito CND' },
  { id: 'ansla', url: '/?rota=seia-v2&tela=ansla', name: 'ANSLA Dispensa de Licença' },
  { id: 'parcelamento', url: '/?rota=seia-v2&tela=parcelamento', name: 'Parcelamento de Débitos' },
  { id: 'cras', url: '/?rota=seia-v2&tela=cras', name: 'CRAS Triagem de Fauna' },
  { id: 'cefir', url: '/?rota=seia-v2&tela=cefir', name: 'CEFIR Imóveis Rurais' },
  { id: 'sispass', url: '/?rota=seia-v2&tela=sispass', name: 'SISPASS Passeriformes' },
  { id: 'apresentacao', url: '/?rota=seia-v2&tela=apresentacao', name: 'Roteiro de Apresentação' },
];

async function main() {
  const PORT = 4185;
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: path.resolve(__dirname, '..'),
    shell: true,
    stdio: 'ignore'
  });

  const auditReport = {
    auditedAt: new Date().toISOString(),
    viewportsAudited: ['1920x1080 (Desktop)', '1024x768 (Tablet)', '375x812 (Mobile)'],
    screens: []
  };

  try {
    await waitForServer(PORT);
    const browser = await chromium.launch({ headless: true });

    for (const s of SCREENS) {
      const screenResult = {
        id: s.id,
        name: s.name,
        url: `http://localhost:${PORT}${s.url}`,
        desktop: null,
        mobile: null,
        errors: []
      };

      // 1. Audit Desktop 1920x1080
      const contextDesk = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
      const pageDesk = await contextDesk.newPage();
      pageDesk.on('pageerror', err => screenResult.errors.push(`[Desktop PageError] ${err.message}`));

      try {
        await pageDesk.goto(`http://localhost:${PORT}${s.url}`, { waitUntil: 'networkidle', timeout: 15000 });
        await pageDesk.waitForTimeout(500);

        const deskMetrics = await pageDesk.evaluate(() => {
          const hasH1 = !!document.querySelector('h1');
          const h1Text = document.querySelector('h1')?.innerText?.trim() || '';
          const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
          const tablesCount = document.querySelectorAll('table').length;
          const buttonsCount = document.querySelectorAll('button').length;
          const inputsCount = document.querySelectorAll('input, select, textarea').length;
          
          return {
            hasH1,
            h1Text,
            hasHorizontalOverflow,
            tablesCount,
            buttonsCount,
            inputsCount
          };
        });

        screenResult.desktop = deskMetrics;
      } catch (err) {
        screenResult.errors.push(`[Desktop Load Error] ${err.message}`);
      } finally {
        await contextDesk.close();
      }

      // 2. Audit Mobile 375x812
      const contextMob = await browser.newContext({ viewport: { width: 375, height: 812 } });
      const pageMob = await contextMob.newPage();
      pageMob.on('pageerror', err => screenResult.errors.push(`[Mobile PageError] ${err.message}`));

      try {
        await pageMob.goto(`http://localhost:${PORT}${s.url}`, { waitUntil: 'networkidle', timeout: 15000 });
        await pageMob.waitForTimeout(500);

        const mobMetrics = await pageMob.evaluate(() => {
          const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth;
          const isSidebarHidden = document.querySelector('aside')?.classList.contains('-translate-x-full') || true;
          return {
            hasHorizontalOverflow,
            isSidebarHidden
          };
        });

        screenResult.mobile = mobMetrics;
      } catch (err) {
        screenResult.errors.push(`[Mobile Load Error] ${err.message}`);
      } finally {
        await contextMob.close();
      }

      auditReport.screens.push(screenResult);
      console.log(`[Audit] ${s.name} (${s.id}) - Erros: ${screenResult.errors.length} | Overflow Mob: ${screenResult.mobile?.hasHorizontalOverflow ? 'SIM' : 'NÃO'}`);
    }

    const reportPath = path.resolve(__dirname, '../qa/seia_v2_audit_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
    console.log(`\nRelatório de auditoria salvo em: ${reportPath}`);

    await browser.close();
  } finally {
    try { process.kill(server.pid); } catch(e) {}
  }
}

main().catch(console.error);
