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

  // Encontrar o botão de 3 pontinhos / Outros na linha do DAE-2026-000033
  const row = page.locator('table tbody tr').filter({ hasText: 'DAE-2026-000033' }).first();
  console.log('Linha achada:', await row.count());

  // Encontrar os botões dentro da linha
  const actionBtns = row.locator('button');
  const count = await actionBtns.count();
  console.log('Botões na linha:', count);
  for (let i = 0; i < count; i++) {
    console.log(`Btn ${i}: text="${await actionBtns.nth(i).innerText()}" title="${await actionBtns.nth(i).getAttribute('title')}" class="${await actionBtns.nth(i).getAttribute('class')}"`);
  }

  // Clicar no botão com ícone de elipse ou título Outros
  const trigger = actionBtns.filter({ hasText: '' }).last();
  console.log('Clicando trigger menu...');
  await trigger.click();
  await page.waitForTimeout(1000);

  // Inspecionar itens do menu que apareceram no DOM
  const menuItems = await page.locator('.fi-dropdown-panel button, [role="menu"] button, .fi-dropdown-list-item').allInnerTexts().catch(() => []);
  console.log('Itens de menu visíveis:\n', menuItems);

  // Clicar em Baixa Manual de DAE
  const baixaBtn = page.locator('button:has-text("Baixa Manual de DAE"), span:has-text("Baixa Manual de DAE")');
  console.log('Botão Baixa Manual visível:', await baixaBtn.isVisible());
  if (await baixaBtn.isVisible()) {
    await baixaBtn.click();
    await page.waitForTimeout(2000);
    
    // Inspecionar o modal de confirmação / formulário de baixa
    const openModals = await page.locator('.fi-modal:not(.hidden)').allInnerTexts().catch(() => []);
    console.log('Modal de Baixa aberto:\n', openModals.map(m => m.replace(/\n+/g, ' | ')));
  }

  await browser.close();
})();
