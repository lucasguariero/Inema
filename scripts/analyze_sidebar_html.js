const fs = require('fs');
const { chromium } = require('playwright');

async function main() {
  const html = fs.readFileSync('qa/screenshots/sidebar_raw.html', 'utf8');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <head></head>
      <body>
        <aside class="fi-sidebar">${html}</aside>
      </body>
    </html>
  `);

  const structure = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    
    // Filament navigation items:
    // Let's check how the DOM is arranged:
    // Are there groups? Let's check .fi-sidebar-group and .inav-group
    const inavItems = Array.from(aside.querySelectorAll('.inav-group, .inav-item-btn'));
    const fiGroups = Array.from(aside.querySelectorAll('.fi-sidebar-group, .fi-sidebar-item'));

    // Check which system is populated
    const inavResult = [];
    const directTop = [];

    // Let's inspect all children of aside or nav
    const nav = aside.querySelector('nav') || aside;
    
    // Let's look for top-level direct links (Início, Iniciar Requerimento, Meus Processos, Notificações, Acesso Público)
    const directLinks = Array.from(aside.querySelectorAll('a.inav-item-btn')).filter(a => !a.closest('.inav-group'));
    
    // Groups with inav-group
    const groups = Array.from(aside.querySelectorAll('.inav-group')).map(g => {
      const btn = g.querySelector('.inav-group-btn');
      const items = Array.from(g.querySelectorAll('a')).map(a => {
        const text = a.innerText.trim();
        const href = a.getAttribute('href');
        return { text, href };
      });
      return {
        groupName: btn ? btn.innerText.trim() : 'Sem Nome',
        items
      };
    });

    // Also check Filament's fi-sidebar-group
    const filamentGroups = Array.from(aside.querySelectorAll('.fi-sidebar-group')).map(g => {
      const label = g.querySelector('.fi-sidebar-group-label, button')?.innerText?.trim();
      const items = Array.from(g.querySelectorAll('.fi-sidebar-item a, li a')).map(a => ({
        text: a.innerText.trim().replace(/\s+/g, ' '),
        href: a.getAttribute('href')
      }));
      return {
        groupName: label,
        items
      };
    });

    return {
      directLinks: directLinks.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') })),
      inavGroupsCount: groups.length,
      inavGroups: groups,
      filamentGroupsCount: filamentGroups.length,
      filamentGroups: filamentGroups.filter(g => g.groupName && g.items.length > 0)
    };
  });

  console.log('Direct links:', structure.directLinks);
  console.log(`inav groups: ${structure.inavGroupsCount}, filament groups: ${structure.filamentGroupsCount}`);
  fs.writeFileSync('qa/screenshots/clean_menu_structure.json', JSON.stringify(structure, null, 2));

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
