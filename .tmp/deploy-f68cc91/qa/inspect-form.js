const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  await page.locator('text=Registrar Emergência Química').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Simular autenticação' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Click Vínculo = Não
  await page.getByLabel('Não').click();
  await page.waitForTimeout(1000);

  const fields = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('input, select, textarea, button[role="combobox"]'));
    return elements.map(el => ({
      tag: el.tagName,
      id: el.id,
      name: el.name,
      placeholder: el.placeholder || '',
      role: el.getAttribute('role') || '',
      ariaLabel: el.getAttribute('aria-label') || '',
      type: el.type || '',
      labelText: el.closest('div.fi-fo-field-wrp')?.querySelector('label')?.textContent?.trim() || ''
    }));
  });

  console.log('--- CAMPOS DO FORMULÁRIO ---');
  fields.forEach(f => {
    if (f.id || f.labelText || f.placeholder) {
      console.log(`[${f.tag}] ID: "${f.id}" | Label: "${f.labelText}" | Role: "${f.role}" | Type: "${f.type}"`);
    }
  });

  await browser.close();
})();
