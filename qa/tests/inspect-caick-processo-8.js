const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Inspecionar processo 8 (número 003 de Caick)
  await page.goto('https://gla-inema-hml.acto.com.br/processos/8', { waitUntil: 'networkidle' });
  const text8 = (await page.innerText('body')).replace(/\n+/g, ' | ');
  console.log('=== PROCESSO 8 (003 de Caick) ===');
  console.log(text8.substring(0, 1500));

  // Inspecionar processo 8 edit para ver campos
  await page.goto('https://gla-inema-hml.acto.com.br/processos/8/edit', { waitUntil: 'networkidle' });
  const inputs8 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label, input, select')).map(el => ({
      tag: el.tagName,
      text: el.innerText ? el.innerText.trim() : '',
      name: el.getAttribute('name'),
      val: el.value || ''
    })).filter(i => i.text || i.name);
  });
  console.log('\n=== FORMULÁRIO PROCESSO 8 EDIT ===');
  console.log(JSON.stringify(inputs8.slice(0, 25), null, 2));

  await browser.close();
})();
