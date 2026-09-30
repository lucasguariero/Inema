const fs = require('fs');

// Since jsdom might not be installed, let's use Playwright to parse the HTML in a page!
const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const html = fs.readFileSync('qa/screenshots/sidebar_raw.html', 'utf8');
  await page.setContent(`<div id="root">${html}</div>`);

  const menuStructure = await page.evaluate(() => {
    const root = document.getElementById('root');

    // Identificar os grupos no menu do GLA
    // No GLA, temos botões com classe inav-group-btn ou fi-sidebar-group
    // Vamos varrer todos os blocos principais
    const results = [];

    // Pegar todos os filhos diretos da lista ou containers
    const items = Array.from(root.querySelectorAll('.fi-sidebar-item, .inav-item, .fi-sidebar-group, li, .inav-group'));

    // Vamos varrer sequencialmente o DOM da sidebar
    // para pegar itens no topo e depois acordeões com seus subitens
    const allNodes = Array.from(root.querySelectorAll('*'));
    
    // Varredura por container de grupo
    const groups = Array.from(root.querySelectorAll('.fi-sidebar-group, [class*="group"]')).filter(g => {
      return g.querySelector('button, .fi-sidebar-group-label, .inav-group-btn');
    });

    const parsedGroups = [];

    // Também pegar os itens soltos (sem grupo no topo)
    const topLinks = [];
    const directLinks = Array.from(root.querySelectorAll('a.inav-btn, a.fi-sidebar-item-button'));
    
    // Abordagem mais robusta: analisar a estrutura pai-filho
    // Procurar todos os botões de acordeão
    const accordionButtons = Array.from(root.querySelectorAll('button.inav-group-btn, button[class*="group"], .fi-sidebar-group-label'));

    accordionButtons.forEach(btn => {
      const groupName = btn.innerText.trim().replace(/\n+/g, ' ');
      // O container de itens geralmente é o próximo elemento irmão ou um filho do mesmo container pai
      let container = btn.nextElementSibling;
      if (!container || container.tagName === 'BUTTON') {
        container = btn.parentElement?.querySelector('ul, ol, div[class*="items"], div[class*="collapse"]');
      }

      const subLinks = container ? Array.from(container.querySelectorAll('a')).map(a => {
        const badge = a.querySelector('.fi-badge, [class*="badge"]')?.innerText?.trim() || null;
        let text = a.innerText.trim().replace(/\n+/g, ' ');
        if (badge) text = text.replace(badge, '').trim();
        return {
          text,
          href: a.getAttribute('href'),
          badge
        };
      }) : [];

      if (groupName) {
        parsedGroups.push({
          group: groupName,
          items: subLinks
        });
      }
    });

    return {
      parsedGroups,
      totalLinks: directLinks.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }))
    };
  });

  fs.writeFileSync('qa/screenshots/gla_parsed_menu.json', JSON.stringify(menuStructure, null, 2));
  console.log('Estrutura salva em qa/screenshots/gla_parsed_menu.json!');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
