const { test, expect } = require('@playwright/test');
const path = require('path');

const pages = [
  { name: 'Início', file: 'src/index.html' },
  { name: 'Fiscalização', file: 'src/fiscalizacao.html' },
  { name: 'Emergência Química', file: 'src/emergencia-quimica.html' },
  { name: 'Gestão de Fauna', file: 'src/fauna.html' },
  { name: 'Relatórios Gerenciais', file: 'src/relatorios.html' },
];

for (const p of pages) {
  test(`Menu lateral em ${p.name} deve conter o módulo de Emergência Química`, async ({ page }) => {
    const filePath = path.resolve(__dirname, '../../', p.file);
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, { waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width: 1280, height: 800 });

    const menuEmergencia = page.locator('#sidebar').getByText('Emergência Química', { exact: false });
    await expect(menuEmergencia.first()).toBeVisible();

    const sublinkInterna = page.locator('#sidebar').getByText(/Visão Interna|Emergência Interna/i);
    const isVisible = await sublinkInterna.first().isVisible();
    if (!isVisible) {
      const btnSubmenu = page.locator('#sidebar button').filter({ hasText: 'Emergência Química' });
      await btnSubmenu.first().click();
      await page.waitForTimeout(300);
    }
    await expect(sublinkInterna.first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });
}
