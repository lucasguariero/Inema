const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Iniciando rastreamento profundo de todas as telas do GLA...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = {
    crawledAt: new Date().toISOString(),
    menuStructure: [],
    pages: []
  };

  try {
    console.log('1. Acessando tela de login...');
    await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('input[type="text"]').first().fill('00000000000');
    await page.locator('input[type="password"]').first().fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(4000);

    console.log('2. Expandindo todos os acordeões e submenus da sidebar...');
    const buttons = await page.locator('aside button, .fi-sidebar button').all();
    for (const b of buttons) {
      try {
        await b.click({ timeout: 1000 });
        await page.waitForTimeout(100);
      } catch (e) {}
    }

    // Extrair toda a estrutura de menus com hierarquia
    const menuTree = await page.evaluate(() => {
      const groups = [];
      const groupElements = document.querySelectorAll('.fi-sidebar-group');
      groupElements.forEach(g => {
        const groupLabel = g.querySelector('.fi-sidebar-group-label, button')?.innerText?.trim() || 'Sem Grupo';
        const items = Array.from(g.querySelectorAll('a')).map(a => ({
          label: a.innerText.trim().replace(/\n+/g, ' '),
          href: a.href,
          badge: a.querySelector('.fi-badge')?.innerText?.trim() || null
        }));
        if (items.length > 0) {
          groups.push({ group: groupLabel, items });
        }
      });
      return groups;
    });

    results.menuStructure = menuTree;
    console.log(`Encontrados ${menuTree.length} grupos no menu principal.`);

    // Coletar todos os links únicos
    const allLinks = [];
    menuTree.forEach(g => {
      g.items.forEach(item => {
        if (item.href && !allLinks.some(l => l.href === item.href)) {
          allLinks.push({ ...item, group: g.group });
        }
      });
    });

    console.log(`Total de ${allLinks.length} rotas únicas para inspecionar.`);

    // Visitar cada página
    for (let i = 0; i < allLinks.length; i++) {
      const link = allLinks[i];
      console.log(`[${i + 1}/${allLinks.length}] Inspecionando: ${link.group} ➔ ${link.label} (${link.href})`);

      try {
        await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(1500);

        const pageInfo = await page.evaluate((meta) => {
          const heading = document.querySelector('h1, .fi-header-heading')?.innerText?.trim() || '';
          const subHeading = document.querySelector('.fi-header-subheading')?.innerText?.trim() || '';
          const breadcrumbs = Array.from(document.querySelectorAll('.fi-breadcrumbs a, .fi-breadcrumbs span')).map(el => el.innerText.trim()).filter(Boolean);
          
          // Abas
          const tabs = Array.from(document.querySelectorAll('.fi-tabs button, .fi-tabs a, [role="tab"]')).map(t => t.innerText.trim().replace(/\n+/g, ' '));
          
          // Botões de ação no topo
          const headerButtons = Array.from(document.querySelectorAll('.fi-header-actions button, .fi-header-actions a, header button')).map(b => b.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
          
          // Colunas de tabelas
          const tableHeaders = Array.from(document.querySelectorAll('table thead th')).map(th => th.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
          
          // Campos de formulário se for página de form
          const formLabels = Array.from(document.querySelectorAll('label, .fi-fo-field-wrp-label')).map(l => l.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
          
          // Widgets / Cards de KPIs
          const widgets = Array.from(document.querySelectorAll('.fi-wi-stats-overview-stat, .fi-section')).map(s => {
            const label = s.querySelector('.fi-wi-stats-overview-stat-label, h3, .fi-section-header-heading')?.innerText?.trim() || '';
            const value = s.querySelector('.fi-wi-stats-overview-stat-value')?.innerText?.trim() || '';
            return { label, value };
          }).filter(w => w.label || w.value);

          // Ações por linha na tabela (se houver)
          const rowActions = Array.from(document.querySelectorAll('table tbody tr:first-child button, table tbody tr:first-child a')).map(a => a.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);

          return {
            group: meta.group,
            menuLabel: meta.label,
            url: window.location.href,
            heading,
            subHeading,
            breadcrumbs,
            tabs,
            headerButtons,
            tableHeaders,
            formLabels: formLabels.slice(0, 30),
            widgets: widgets.slice(0, 10),
            rowActions: rowActions.slice(0, 10)
          };
        }, link);

        results.pages.push(pageInfo);
      } catch (err) {
        console.error(`Erro ao inspecionar ${link.href}:`, err.message);
        results.pages.push({
          group: link.group,
          menuLabel: link.label,
          url: link.href,
          error: err.message
        });
      }
    }

    const dumpPath = path.resolve(__dirname, '../qa/gla_deep_crawl_dump.json');
    fs.writeFileSync(dumpPath, JSON.stringify(results, null, 2));
    console.log(`\nRastreamento concluído com sucesso! Salvo em: ${dumpPath}`);

  } finally {
    await browser.close();
  }
}

main().catch(console.error);
