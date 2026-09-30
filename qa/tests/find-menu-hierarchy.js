const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const allLinks = Array.from(document.querySelectorAll('aside a, .fi-sidebar a'));
    const certidaoLinks = allLinks.filter(a => a.href && a.href.includes('certidao'));
    return certidaoLinks.map(a => {
      // achar o grupo/agrupador pai
      let p = a.parentElement;
      let groupName = '';
      while (p && p.tagName !== 'ASIDE') {
        const groupLabel = p.querySelector('.fi-sidebar-group-label, button');
        if (groupLabel && !groupName) groupName = groupLabel.innerText.trim();
        p = p.parentElement;
      }
      return {
        text: a.innerText.trim().replace(/\n+/g, ' '),
        href: a.href,
        group: groupName
      };
    });
  });

  console.log('Links de certidão e seus grupos no menu:\n', JSON.stringify(result, null, 2));

  await browser.close();
})();
