const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Admin
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2500);

  // Acessar Escalas de Plantão
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao');
  await page.waitForTimeout(2000);

  // Clicar em "+ Cadastrar Escala"
  const btnCadastrar = page.locator('a:has-text("Cadastrar Escala"), button:has-text("Cadastrar Escala")').first();
  await btnCadastrar.click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-form-escala-aberto.png', fullPage: true });

  // Inspecionar inputs
  console.log('Formulário de Escala aberto. URL:', page.url());
  const inputs = await page.locator('input').all();
  for (let i = 0; i < inputs.length; i++) {
    const id = await inputs[i].getAttribute('id');
    const name = await inputs[i].getAttribute('name');
    const type = await inputs[i].getAttribute('type');
    console.log(`Input [${i}]: id="${id}", name="${name}", type="${type}"`);
  }

  const comboboxes = await page.locator('button[role="combobox"]').all();
  console.log('Comboboxes count:', comboboxes.length);

  await browser.close();
})();
