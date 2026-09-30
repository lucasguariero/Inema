const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  console.log('Logging in as Lucas...');
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[id*="cpf"]').first().fill('99292474081');
  await page.locator('input[type="password"]').first().fill('Inema@2026');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
  console.log('Lucas URL:', page.url());
  
  const links = await page.locator('a').all();
  console.log('Links found for Lucas:');
  for (const link of links) {
    const text = (await link.innerText()).trim();
    const href = await link.getAttribute('href');
    if (text && (text.toLowerCase().includes('atividade') || text.toLowerCase().includes('processo') || text.toLowerCase().includes('silo') || text.toLowerCase().includes('licenciamento') || text.toLowerCase().includes('ansla'))) {
      console.log(' - [' + text.replace(/\n/g, ' ') + '] => ' + href);
    }
  }

  const sidebarItems = await page.locator('.fi-sidebar-item, aside li, nav li').all();
  console.log('\nSidebar items count:', sidebarItems.length);
  for (const item of sidebarItems) {
    const t = (await item.innerText()).trim();
    if (t) console.log(' Item: ' + t.replace(/\n/g, ' '));
  }

  await page.screenshot({ path: 'qa/screenshots/debug-lucas-nav.png' });

  console.log('\nLogging in as Admin...');
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[id*="cpf"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
  console.log('Admin URL:', page.url());
  
  const adminLinks = await page.locator('a').all();
  console.log('Links found for Admin:');
  for (const link of adminLinks) {
    const text = (await link.innerText()).trim();
    const href = await link.getAttribute('href');
    if (text && (text.toLowerCase().includes('atividade') || text.toLowerCase().includes('processo') || text.toLowerCase().includes('silo') || text.toLowerCase().includes('licenciamento') || text.toLowerCase().includes('ansla'))) {
      console.log(' - [' + text.replace(/\n/g, ' ') + '] => ' + href);
    }
  }

  const adminSidebarItems = await page.locator('.fi-sidebar-item, aside li, nav li').all();
  console.log('\nAdmin Sidebar items count:', adminSidebarItems.length);
  for (const item of adminSidebarItems) {
    const t = (await item.innerText()).trim();
    if (t) console.log(' Admin Item: ' + t.replace(/\n/g, ' '));
  }

  await page.screenshot({ path: 'qa/screenshots/debug-admin-nav.png' });
  await browser.close();
})();
