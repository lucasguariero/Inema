const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.locator('button[type="submit"], button:has-text("Entrar")').click();
  await page.waitForTimeout(4000);

  // Pega todo o HTML da sidebar
  const sidebarHtml = await page.evaluate(() => {
    const sidebar = document.querySelector('aside, .fi-sidebar, .fi-main-sidebar');
    return sidebar ? sidebar.innerHTML : 'Não encontrado';
  });

  fs.writeFileSync('qa/screenshots/sidebar_raw.html', sidebarHtml);

  // Também extrai todos os elementos de texto e links da sidebar
  const itemsDetailed = await page.evaluate(() => {
    const sidebar = document.querySelector('aside, .fi-sidebar, .fi-main-sidebar');
    if (!sidebar) return [];

    // Todos os links
    const links = Array.from(sidebar.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim().replace(/\n+/g, ' '),
      href: a.getAttribute('href'),
      classes: a.className
    }));

    // Todos os botões (geralmente os accordions)
    const buttons = Array.from(sidebar.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim().replace(/\n+/g, ' '),
      classes: b.className
    }));

    return { links, buttons };
  });

  fs.writeFileSync('qa/screenshots/sidebar_detailed.json', JSON.stringify(itemsDetailed, null, 2));
  console.log('Sidebar detalhada salva com sucesso!');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});


main().catch(err => {
  console.error(err);
  process.exit(1);
});


