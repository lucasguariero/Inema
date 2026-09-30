const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const outputDir = path.resolve(__dirname, '../prints_inema_novo_4k_16x9');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Iniciando navegador Playwright (viewport 1920x1080 @ 2x -> 3840x2160 4K UHD 16:9)...');
  const browser = await chromium.launch({ headless: true });
  
  const baseUrl = 'https://inema-lucas.vercel.app';

  // Lista dos 15 cenários oficiais do INEMA NOVO (Versão Verde / Redesign Shadcn-Filament)
  const scenarios = [
    // --- MÓDULO REGULAÇÃO: DASHBOARD GERENCIAL ---
    {
      id: '01_inema_novo_dashboard_verde',
      title: 'Regulação: Dashboard Gerencial (Modo Claro - Verde Floresta)',
      url: `${baseUrl}/?rota=relatorios&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '02_inema_novo_dashboard_filtros',
      title: 'Regulação: Dashboard com Painel Lateral de Filtros Avançados',
      url: `${baseUrl}/?rota=relatorios&theme=verde&dark=false`,
      openFilter: true,
      isDark: false
    },
    {
      id: '03_inema_novo_dashboard_dark',
      title: 'Regulação: Dashboard Gerencial (Dark Mode)',
      url: `${baseUrl}/?rota=relatorios&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: DENÚNCIA INTERNA (DOR001) ---
    {
      id: '04_inema_novo_denuncia_interna_light',
      title: 'Fiscalização: Denúncia Interna DIFIS (DOR001 - Modo Claro)',
      url: `${baseUrl}/?rota=atendente&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '05_inema_novo_denuncia_interna_dark',
      title: 'Fiscalização: Denúncia Interna DIFIS (DOR001 - Dark Mode)',
      url: `${baseUrl}/?rota=atendente&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: DENÚNCIA CIDADÃO (DOR002) ---
    {
      id: '06_inema_novo_denuncia_externa_light',
      title: 'Fiscalização: Denúncia Cidadão (DOR002 - Modo Claro)',
      url: `${baseUrl}/?rota=cidadao&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '07_inema_novo_denuncia_externa_dark',
      title: 'Fiscalização: Denúncia Cidadão (DOR002 - Dark Mode)',
      url: `${baseUrl}/?rota=cidadao&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: EMERGÊNCIA QUÍMICA INTERNA (DOR003) ---
    {
      id: '08_inema_novo_emergencia_interna_light',
      title: 'Emergência Química: Cadastro Interno DIFIS (DOR003 - Modo Claro)',
      url: `${baseUrl}/?rota=emergencia-interna&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '09_inema_novo_emergencia_interna_dark',
      title: 'Emergência Química: Cadastro Interno DIFIS (DOR003 - Dark Mode)',
      url: `${baseUrl}/?rota=emergencia-interna&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: EMERGÊNCIA QUÍMICA EXTERNA (DOR004) ---
    {
      id: '10_inema_novo_emergencia_externa_light',
      title: 'Emergência Química: Comunicação Externa (DOR004 - Modo Claro)',
      url: `${baseUrl}/?rota=emergencia-externa&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '11_inema_novo_emergencia_externa_dark',
      title: 'Emergência Química: Comunicação Externa (DOR004 - Dark Mode)',
      url: `${baseUrl}/?rota=emergencia-externa&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: CONSULTA CIDADÃO ---
    {
      id: '12_inema_novo_consulta_externa_light',
      title: 'Acompanhamento Cidadão: Consulta Pública (Modo Claro)',
      url: `${baseUrl}/?rota=consulta-externa&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '13_inema_novo_consulta_externa_dark',
      title: 'Acompanhamento Cidadão: Consulta Pública (Dark Mode)',
      url: `${baseUrl}/?rota=consulta-externa&theme=verde&dark=true`,
      isDark: true
    },

    // --- MÓDULO FISCALIZAÇÃO: PAINEL INTERNO DIFIS ---
    {
      id: '14_inema_novo_consulta_interna_light',
      title: 'Operações DIFIS: Painel Técnico Centralizado (Modo Claro)',
      url: `${baseUrl}/?rota=consulta-interna&theme=verde&dark=false`,
      isDark: false
    },
    {
      id: '15_inema_novo_consulta_interna_dark',
      title: 'Operações DIFIS: Painel Técnico Centralizado (Dark Mode)',
      url: `${baseUrl}/?rota=consulta-interna&theme=verde&dark=true`,
      isDark: true
    }
  ];

  try {
    for (let i = 0; i < scenarios.length; i++) {
      const item = scenarios[i];
      console.log(`[${i + 1}/${scenarios.length}] Capturando: ${item.title}...`);

      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2,
        colorScheme: item.isDark ? 'dark' : 'light'
      });
      const page = await context.newPage();

      await page.goto(item.url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      if (item.openFilter) {
        try {
          const filterBtn = page.getByRole('button', { name: /filtros/i }).first();
          if (await filterBtn.isVisible()) {
            await filterBtn.click();
            await page.waitForTimeout(700);
          }
        } catch (e) {
          console.log('Aviso ao abrir filtros:', e.message);
        }
      }

      const filePath = path.join(outputDir, `${item.id}.png`);
      await page.screenshot({ path: filePath });
      console.log(`Salvo com sucesso: ${item.id}.png`);

      await context.close();
    }

    console.log('\n=== TODAS AS 15 TELAS DO INEMA NOVO (4K UHD 16:9) FORAM CAPTURADAS COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro na captura:', err);
  } finally {
    await browser.close();
  }
}

main();
