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

  console.log('1. Selecionando Tipo de Responsável...');
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(1500);

  console.log('2. Inspecionando dropdown Tipo de Atividade...');
  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(1000);
  
  // Dump the HTML around the combobox to understand the structure
  const dropdownContainer = await page.locator('button#form\\.ansa_tati_id').evaluate(el => {
    // Find the closest container that has the dropdown
    let parent = el.parentElement;
    for (let i = 0; i < 5; i++) {
      if (parent) parent = parent.parentElement;
    }
    return parent ? parent.innerHTML.substring(0, 3000) : 'not found';
  });
  console.log('Dropdown container HTML (first 3000):', dropdownContainer);

  // Check for all li elements
  const lis = await page.locator('li[role="option"]').all();
  console.log('\nAll li[role=option] count:', lis.length);
  for (const li of lis) {
    const text = (await li.innerText()).trim();
    const visible = await li.isVisible();
    console.log(`  li: visible=${visible} text="${text}"`);
  }

  await browser.close();
})();
