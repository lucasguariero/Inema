const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Procurar tela de usuários
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('user') || l.href.includes('usuario')));
  });
  console.log('Links de usuários:\n', JSON.stringify(links, null, 2));

  if (links.length > 0) {
    await page.goto(links[0].href, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const rows = await page.locator('table tbody tr').allInnerTexts().catch(() => []);
    console.log('Total usuários listados:', rows.length);
    for (const r of rows.slice(0, 10)) {
      console.log('->', r.replace(/\n+/g, ' | '));
    }
  }

  await browser.close();
})();
