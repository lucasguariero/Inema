const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/dae/daes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Primeiro abrir o dropdown "Outros"
  const trigger = page.locator('table tbody tr').first().locator('button[title="Outros"], button.fi-icon-btn');
  await trigger.click();
  await page.waitForTimeout(1000);

  // Clicar no botão "Baixa Manual de DAE"
  const btnBaixa = page.locator('button:has-text("Baixa Manual de DAE"), [role="menuitem"]:has-text("Baixa Manual de DAE")');
  console.log('Botão Baixa Manual count:', await btnBaixa.count());
  await btnBaixa.first().click();
  await page.waitForTimeout(2000);

  // Inspecionar o modal que abriu
  const modal = page.locator('.fi-modal-window, [role="dialog"]').first();
  console.log('Modal text:\n', (await modal.innerText()).replace(/\n+/g, ' | '));

  // Inspecionar campos do modal
  const inputs = await modal.evaluate(el => {
    return Array.from(el.querySelectorAll('input, select, textarea, button')).map(i => ({
      tag: i.tagName,
      type: i.getAttribute('type'),
      name: i.getAttribute('name'),
      text: i.innerText.trim(),
      value: i.value
    }));
  });
  console.log('Campos do modal:\n', JSON.stringify(inputs, null, 2));

  await browser.close();
})();
