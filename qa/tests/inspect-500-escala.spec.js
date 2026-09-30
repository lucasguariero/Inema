const { test } = require('@playwright/test');
const { attachNetworkLogger } = require('../utils/qa-helper');

async function setFilamentDate(page, inputId, dateIso) {
  await page.evaluate(({ id, val }) => {
    const el = document.getElementById(id);
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) {
      data.state = val;
    }
  }, { id: inputId, val: dateIso });
}

test('inspect 500 error on escala save', async ({ page }) => {
  const logger = attachNetworkLogger(page);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Select plantonista
  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  await page.locator('li[role="option"]:has-text("Bruno Carvalho")').first().click();
  await page.waitForTimeout(600);

  // Select municipio
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Set dates directly: 08/09/2026 to 20/09/2026
  await setFilamentDate(page, 'form.espl_data_inicio', '2026-09-08');
  await setFilamentDate(page, 'form.espl_data_fim', '2026-09-20');
  await page.waitForTimeout(1000);

  // Click Criar
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(4000);

  console.log('NETWORK ERRORS:');
  console.log(JSON.stringify(logger.errors, null, 2));
});
