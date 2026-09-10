const { test, expect } = require('@playwright/test');
const { attachNetworkLogger } = require('../utils/qa-helper');

test('DOR003 - Blocos 1 e 2: Plantonistas e Escalas de Plantao (Admin)', async ({ page }) => {
  test.setTimeout(180000);
  const logger = attachNetworkLogger(page);

  console.log('=== 1. Login como Admin ===');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  expect(page.url()).not.toContain('/login');
  console.log('Admin logado com sucesso! URL:', page.url());

  // Inspecionar menus disponiveis
  const menus = await page.locator('nav a, aside a, .fi-sidebar-item-label').allInnerTexts();
  console.log('Menus encontrados:', menus.filter(m => m.trim().length > 0));

  // Tentar navegar para Plantonistas
  console.log('Navegando para Administracao > Fiscalizacao > Plantonistas...');
  const menuAdmin = page.locator('text=Administração, span:has-text("Administração")').first();
  if (await menuAdmin.isVisible().catch(() => false)) {
    await menuAdmin.click();
    await page.waitForTimeout(500);
  }

  // Capturar tela da sidebar
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/debug-admin-sidebar.png' });

  // Tentar URLs diretas se existirem ou cliques
  const links = await page.locator('a[href*="plantonista"], a[href*="escala"]').all();
  console.log('Links encontrados com plantonista/escala:', links.length);
  for (const l of links) {
    console.log('Link:', await l.getAttribute('href'), await l.innerText());
  }
});
