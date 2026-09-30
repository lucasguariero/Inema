const { test, expect } = require('@playwright/test');

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

test('test escala filter Vigente em', async ({ page }) => {
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

  // Inspecionar inputs do filtro aberto
  const filterInputId = await page.$eval('.fi-dropdown-panel input.fi-fo-date-time-picker-display-text-input', el => el.id).catch(() => null);
  console.log('Filter date input ID:', filterInputId);

  if (filterInputId) {
    // 1. Filtrar por 15/09/2026 (vigente)
    await setFilamentDate(page, filterInputId, '2026-09-15');
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Aplicar filtros")').click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Filtro escala vigente 15-09.png' });
    console.log('✔ Print 04 capturado: Filtro 15/09/2026.');

    // 2. Filtrar por 15/11/2026 (sem escalas / vazio)
    await page.locator('button[aria-label="Filtrar"], button[title="Filtrar"]').click();
    await page.waitForTimeout(800);
    await setFilamentDate(page, filterInputId, '2026-11-15');
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Aplicar filtros")').click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 05 - Filtro escala vigente 15-11 vazia.png' });
    console.log('✔ Print 05 capturado: Filtro 15/11/2026 vazio.');
  } else {
    // Fallback: se não tiver input id específico, tira print do painel de filtros
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 04 - Filtro escalas aberto.png' });
  }
});
