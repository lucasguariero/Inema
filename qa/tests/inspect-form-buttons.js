const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(2000);

  const mainForm = page.locator('form[wire\\:submit="save"]');
  const btns = await mainForm.locator('button').all();
  console.log('Main form buttons count:', btns.length);
  for (const b of btns) {
    const txt = (await b.innerText()).trim();
    const id = await b.getAttribute('id');
    const role = await b.getAttribute('role');
    console.log(`Button id=${id} role=${role} text="${txt.replace(/\n/g, ' ')}"`);
  }

  await browser.close();
})();
