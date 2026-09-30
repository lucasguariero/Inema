const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('Navigating to login...');
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.fill('#data\\.cpf', '00000000000');
  await page.fill('#data\\.password', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });
  console.log('Logged in successfully, current url:', page.url());

  // Click all collapsed groups to expand them
  const buttons = await page.$$('button.inav-group-btn');
  console.log(`Found ${buttons.length} inav-group-btn buttons`);
  for (const btn of buttons) {
    try {
      const expanded = await btn.getAttribute('aria-expanded');
      if (expanded === 'false' || !expanded) {
        await btn.click({ timeout: 500 }).catch(() => {});
      }
    } catch (e) {}
  }
  await page.waitForTimeout(1000);

  // Extract menu directly in DOM order
  const menuData = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return { error: 'No aside found' };

    const allElements = Array.from(aside.querySelectorAll('a.inav-item-btn, .inav-group'));
    const parsedMenu = [];

    for (const el of allElements) {
      if (el.classList.contains('inav-group')) {
        const groupBtn = el.querySelector('.inav-group-btn');
        const groupName = groupBtn ? groupBtn.innerText.trim().replace(/\s+/g, ' ') : 'Grupo';
        
        const links = Array.from(el.querySelectorAll('a')).map(a => {
          const badgeEl = a.querySelector('.badge, .fi-badge, [class*="badge"], span[class*="rounded"]');
          let badge = badgeEl ? badgeEl.innerText.trim() : null;
          let text = a.innerText.trim().replace(/\s+/g, ' ');
          if (badge && text.endsWith(badge)) {
            text = text.substring(0, text.length - badge.length).trim();
          }
          const isDisabled = a.classList.contains('inav-disabled') || a.getAttribute('href') === '#';
          return {
            text,
            href: a.getAttribute('href'),
            badge: badge || (isDisabled && text.includes('Em breve') ? 'Em breve' : null),
            disabled: isDisabled
          };
        });

        parsedMenu.push({
          type: 'group',
          name: groupName,
          items: links
        });
      } else if (el.tagName === 'A' && !el.closest('.inav-group')) {
        const badgeEl = el.querySelector('.badge, .fi-badge, [class*="badge"]');
        let badge = badgeEl ? badgeEl.innerText.trim() : null;
        let text = el.innerText.trim().replace(/\s+/g, ' ');
        if (badge && text.endsWith(badge)) {
          text = text.substring(0, text.length - badge.length).trim();
        }
        parsedMenu.push({
          type: 'direct',
          name: text,
          href: el.getAttribute('href'),
          badge
        });
      }
    }

    return { parsedMenu };
  });

  fs.writeFileSync('qa/screenshots/live_gla_menu_extracted.json', JSON.stringify(menuData, null, 2));
  console.log('Saved live GLA menu to qa/screenshots/live_gla_menu_extracted.json');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
