const fs = require('fs');
const { chromium } = require('playwright');

async function main() {
  const html = fs.readFileSync('qa/screenshots/sidebar_raw.html', 'utf8');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setContent(`<!DOCTYPE html><html><body>${html}</body></html>`);

  const menu = await page.evaluate(() => {
    // Only look at the main navigation (.fi-sidebar-nav)
    const nav = document.querySelector('.fi-sidebar-nav') || document.body;

    // Direct items before any group
    const directLis = Array.from(nav.querySelectorAll(':scope > ul > li.fi-sidebar-item, :scope > ul > li > a.fi-sidebar-item-btn'));
    
    // Filament groups
    const groupEls = Array.from(nav.querySelectorAll('.fi-sidebar-group'));
    const parsedGroups = [];

    groupEls.forEach(g => {
      const labelEl = g.querySelector('.fi-sidebar-group-label, button.fi-sidebar-group-button, [class*="group-label"], button span');
      const title = labelEl ? labelEl.innerText.trim().replace(/\s+/g, ' ') : '';
      
      const subItems = Array.from(g.querySelectorAll('.fi-sidebar-item, li')).map(li => {
        const a = li.querySelector('a');
        if (!a) return null;
        const badgeEl = li.querySelector('.fi-badge, [class*="badge"]');
        const badge = badgeEl ? badgeEl.innerText.trim() : null;
        let text = a.innerText.trim().replace(/\s+/g, ' ');
        if (badge && text.includes(badge)) {
          text = text.replace(badge, '').trim();
        }
        return {
          text,
          href: a.getAttribute('href'),
          badge
        };
      }).filter(Boolean);

      // Deduplicate subItems inside this group by text + href
      const seen = new Set();
      const uniqueSubItems = [];
      for (const item of subItems) {
        const k = item.text + '|' + item.href;
        if (!seen.has(k)) {
          seen.add(k);
          uniqueSubItems.push(item);
        }
      }

      if (title || uniqueSubItems.length > 0) {
        parsedGroups.push({
          group: title,
          items: uniqueSubItems
        });
      }
    });

    return {
      topDirectCount: directLis.length,
      topDirect: directLis.map(li => ({
        text: li.innerText.trim().replace(/\s+/g, ' '),
        href: li.querySelector('a')?.getAttribute('href') || li.getAttribute('href')
      })),
      groups: parsedGroups
    };
  });

  console.log('Parsed groups count:', menu.groups.length);
  menu.groups.forEach((g, i) => {
    console.log(`[${i + 1}] Group: "${g.group}" (${g.items.length} items)`);
    g.items.forEach(it => {
      console.log(`    - ${it.text} (${it.href}) ${it.badge ? '[' + it.badge + ']' : ''}`);
    });
  });

  fs.writeFileSync('qa/screenshots/live_menu_filament_hierarchy.json', JSON.stringify(menu, null, 2));
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
