const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE AÇÕES DO MENU LINHA CARD 10 ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Localizar o primeiro botão de ações / dropdown na linha
  const row = page.locator('table tbody tr').first();
  const rowActionsBtn = row.locator('button').last();
  console.log('Clicando no botão de ações da linha...');
  await rowActionsBtn.click();
  await page.waitForTimeout(1000);

  // Itens visíveis no menu suspenso
  const menuItems = await page.locator('[role="menuitem"], .fi-dropdown-list-item, button:has-text("Histórico"), button:has-text("Tramitar")').all();
  console.log('Total de itens no menu:', menuItems.length);
  for (const item of menuItems) {
    console.log(' - Item:', (await item.innerText()).trim());
  }

  // Clicar em "Ver Histórico de Tramitações"
  const itemHist = page.locator('button:has-text("Histórico"), [role="menuitem"]:has-text("Histórico")').first();
  if (await itemHist.count() > 0) {
    console.log('Clicando em Ver Histórico...');
    await itemHist.click();
    await page.waitForTimeout(2000);

    const modal = page.locator('[role="dialog"], .fi-modal').first();
    const modalText = await modal.innerText().catch(() => '');
    console.log('\n--- CONTEÚDO MODAL HISTÓRICO ---\n', modalText.substring(0, 800));
    
    // Verificar abas dentro do modal
    const modalTabs = await modal.locator('[role="tab"], button').allInnerTexts();
    console.log('Abas / Botões no modal:', modalTabs.map(t => t.trim()).filter(Boolean));

    // Fechar
    const closeBtn = modal.locator('button:has-text("Fechar"), button[aria-label*="close" i]').first();
    if (await closeBtn.count() > 0) await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  await browser.close();
})();
