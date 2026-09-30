const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/processos/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Create Processo URL:', page.url(), 'Title:', await page.title());
  
  if (!page.url().includes('404')) {
    const fields = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('label, select, input')).map(el => ({
        tag: el.tagName,
        text: el.innerText ? el.innerText.trim() : '',
        name: el.getAttribute('name'),
        type: el.getAttribute('type')
      }));
    });
    console.log('Campos em /processos/create:\n', JSON.stringify(fields.slice(0, 20), null, 2));

    // Ver opções do campo Tipo de Processo se houver select
    const tipos = await page.evaluate(() => {
      const sel = document.querySelector('select[name*="tipo"], select');
      if (!sel) return [];
      return Array.from(sel.options).map(o => o.text);
    });
    console.log('Tipos de processo:\n', tipos);
  }

  await browser.close();
})();
