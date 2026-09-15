const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('1. Acessando tela de login...');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  
  // Pegar logo da tela de login se houver
  const loginLogo = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img, svg'));
    return imgs.map(el => ({
      tag: el.tagName,
      src: el.src || null,
      alt: el.alt || null,
      html: el.outerHTML.substring(0, 500),
      className: el.className
    }));
  });
  console.log('Logos na tela de login:', JSON.stringify(loginLogo, null, 2));

  // Tentar login com Lucas
  console.log('2. Realizando login...');
  await page.locator('input[type="text"]').first().fill('99292474081');
  await page.locator('input[type="password"]').first().fill('Inema@2026');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(5000);
  console.log('URL pós-login:', page.url());

  // Salvar screenshot do dashboard
  fs.mkdirSync('qa/screenshots/gla_inspection', { recursive: true });
  await page.screenshot({ path: 'qa/screenshots/gla_inspection/dashboard.png', fullPage: true });

  // Inspecionar logo no topo pós-login
  const topLogo = await page.evaluate(() => {
    const brand = document.querySelector('.fi-logo, [class*="logo"], header img, header svg, nav img, nav svg, aside img, aside svg');
    const header = document.querySelector('header');
    const aside = document.querySelector('aside');
    return {
      brandHtml: brand ? brand.outerHTML : null,
      headerHtml: header ? header.outerHTML.substring(0, 2000) : null,
      asideHeaderHtml: aside ? aside.querySelector('.fi-sidebar-header, header, [class*="header"]')?.outerHTML : null,
    };
  });
  console.log('Top Logo / Header:', JSON.stringify(topLogo, null, 2));

  // Extrair todos os logos encontrados na página
  const allLogos = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img, svg')).map(el => ({
      tag: el.tagName,
      src: el.src || el.getAttribute('src') || null,
      outerHTML: el.outerHTML,
      parentClass: el.parentElement?.className || null
    })).filter(x => x.src?.includes('logo') || x.outerHTML.includes('logo') || x.outerHTML.includes('inema') || x.outerHTML.includes('INEMA'));
  });
  console.log('Todos os logos encontrados:', JSON.stringify(allLogos, null, 2));

  // Inspecionar cores e fontes computadas
  const computedStyles = await page.evaluate(() => {
    const body = document.body;
    const bodyStyle = window.getComputedStyle(body);
    const header = document.querySelector('header');
    const headerStyle = header ? window.getComputedStyle(header) : null;
    const sidebar = document.querySelector('aside, .fi-main-sidebar');
    const sidebarStyle = sidebar ? window.getComputedStyle(sidebar) : null;
    const activeItem = document.querySelector('.fi-sidebar-item.fi-active, [class*="active"]');
    const activeStyle = activeItem ? window.getComputedStyle(activeItem) : null;
    const h1 = document.querySelector('h1');
    const h1Style = h1 ? window.getComputedStyle(h1) : null;

    return {
      fontFamily: bodyStyle.fontFamily,
      backgroundColor: bodyStyle.backgroundColor,
      headerBg: headerStyle?.backgroundColor,
      headerBorder: headerStyle?.borderColor,
      sidebarBg: sidebarStyle?.backgroundColor,
      sidebarBorder: sidebarStyle?.borderColor,
      sidebarWidth: sidebarStyle?.width,
      activeItemBg: activeStyle?.backgroundColor,
      activeItemColor: activeStyle?.color,
      h1Font: h1Style?.fontFamily,
      h1Size: h1Style?.fontSize,
      h1Weight: h1Style?.fontWeight,
      h1Color: h1Style?.color,
    };
  });
  console.log('Estilos computados:', JSON.stringify(computedStyles, null, 2));

  // Inspecionar os links e módulos do Menu Lateral (Sidebar)
  const sidebarItems = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll('.fi-sidebar-group, [class*="sidebar-group"]'));
    return groups.map(g => {
      const label = g.querySelector('.fi-sidebar-group-label, [class*="label"]')?.innerText?.trim() || 'Sem Grupo';
      const items = Array.from(g.querySelectorAll('.fi-sidebar-item, a')).map(a => ({
        text: a.innerText?.trim()?.replace(/\n+/g, ' '),
        href: a.getAttribute('href')
      }));
      return { label, items };
    });
  });
  console.log('Grupos do Sidebar:', JSON.stringify(sidebarItems, null, 2));

  // Se houver tabelas de listagem, inspecionar
  const tableUrls = [
    'https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico',
    'https://gla-inema-hml.acto.com.br/escalas-plantao',
    'https://gla-inema-hml.acto.com.br/meus-perfis'
  ];

  for (const url of tableUrls) {
    try {
      console.log(`Navegando para ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      const name = url.split('/').pop();
      await page.screenshot({ path: `qa/screenshots/gla_inspection/${name}.png`, fullPage: true });

      const tableData = await page.evaluate(() => {
        const table = document.querySelector('table');
        if (!table) return null;
        const ths = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
        const sampleRow = Array.from(table.querySelectorAll('tbody tr:first-child td')).map(td => td.innerText.trim());
        const thStyle = window.getComputedStyle(table.querySelector('th') || table);
        const tdStyle = window.getComputedStyle(table.querySelector('td') || table);
        return {
          headers: ths,
          sampleRow,
          thBg: thStyle.backgroundColor,
          thColor: thStyle.color,
          thFont: thStyle.fontFamily,
          thSize: thStyle.fontSize,
          tdColor: tdStyle.color,
          tdSize: tdStyle.fontSize,
          tdFont: tdStyle.fontFamily
        };
      });
      console.log(`Tabela em ${name}:`, JSON.stringify(tableData, null, 2));
    } catch (err) {
      console.log(`Erro ao navegar para ${url}:`, err.message);
    }
  }

  // Gravar tudo num arquivo de resultado bruto
  fs.writeFileSync('qa/screenshots/gla_inspection/raw_data.json', JSON.stringify({
    loginLogo,
    topLogo,
    allLogos,
    computedStyles,
    sidebarItems
  }, null, 2));

  await browser.close();
  console.log('Inspeção finalizada com sucesso!');
})();
