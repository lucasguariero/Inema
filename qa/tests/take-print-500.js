const { chromium } = require('playwright');
const fs = require('fs');

async function setFilamentDate(page, inputId, dateIso) {
  await page.evaluate(({ id, val }) => {
    const el = document.getElementById(id);
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) data.state = val;
  }, { id: inputId, val: dateIso });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Select plantonista Bruno Carvalho
  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  await page.locator('li[role="option"]:has-text("Bruno Carvalho")').first().click();
  await page.waitForTimeout(600);

  // Select municipio Salvador
  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Set overlapping dates (08/09/2026 to 20/09/2026)
  await setFilamentDate(page, 'form.espl_data_inicio', '2026-09-08');
  await setFilamentDate(page, 'form.espl_data_fim', '2026-09-20');
  await page.waitForTimeout(1000);

  // Click Criar to trigger the 500 error
  console.log('Submetendo escala duplicada...');
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  // Take screenshot of the screen with the error
  const printPath = 'qa/cards/card-03-emergencia-interna/prints/Print - Erro 500 escala duplicada.png';
  await page.screenshot({ path: printPath, fullPage: true });
  console.log('Screenshot salvo em:', printPath);

  // Also log visible text or modal text
  const bodyText = await page.locator('body').innerText();
  console.log('Body text excerpt:', bodyText.substring(0, 500).replace(/\n/g, ' '));

  await browser.close();
})();
