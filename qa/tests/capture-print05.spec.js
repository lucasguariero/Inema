const { test } = require('@playwright/test');

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

test('capture print 05 filter vazio', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click Filtrar
  await page.locator('button[aria-label="Filtrar"], button[title="Filtrar"]').click();
  await page.waitForTimeout(800);

  // Set to 15/11/2026
  await setFilamentDate(page, 'tableFiltersForm.vigente_em.data', '2026-11-15');
  await page.waitForTimeout(500);

  await page.locator('button:has-text("Aplicar filtros")').click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 05 - Filtro escala vigente 15-11 vazia.png' });
  console.log('✔ Print 05 capturado!');
});
