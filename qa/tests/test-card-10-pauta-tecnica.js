const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE CARD 10: PAUTA TÉCNICA DE ENQUADRAMENTO (SPEC 048) ===');

  // Login como Admin (técnico)
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar Pauta Técnica
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('1. URL atual:', page.url());

  // Inspecionar Abas
  const tabElements = await page.locator('[role="tab"], nav button, .fi-tabs-item').allInnerTexts();
  console.log('2. Abas encontradas:', tabElements.map(t => t.trim()).filter(Boolean));

  // Inspecionar Colunas da Tabela
  const ths = await page.locator('table th').allInnerTexts();
  console.log('3. Colunas da tabela:', ths.map(t => t.trim()).filter(Boolean));

  // Inspecionar Linhas da Tabela
  const rows = await page.locator('table tbody tr').count();
  console.log('4. Linhas na tabela:', rows);

  if (rows > 0) {
    const firstRowText = await page.locator('table tbody tr').first().innerText();
    console.log('5. Primeira linha:', firstRowText.replace(/\n+/g, ' | '));

    // Inspecionar todos os botões/links da linha
    const actions = await page.locator('table tbody tr').first().locator('button, a').all();
    console.log('6. Ações na primeira linha:', actions.length);
    for (let i = 0; i < actions.length; i++) {
      const title = await actions[i].getAttribute('title').catch(() => '');
      const aria = await actions[i].getAttribute('aria-label').catch(() => '');
      const txt = (await actions[i].innerText().catch(() => '')).trim();
      console.log(`   Ação [${i}]: text="${txt}" title="${title}" aria="${aria}"`);
    }

    // Verificar se há dropdown de ações / Outros
    const outrosBtn = page.locator('table tbody tr').first().locator('button:has-text("Outros"), button:has-text("Ações"), [aria-label*="ações" i], [aria-label*="outros" i], [title*="outros" i]');
    if (await outrosBtn.count() > 0) {
      console.log('Clicando em Outros...');
      await outrosBtn.first().click();
      await page.waitForTimeout(1500);
      const dropdownItems = await page.locator('.fi-dropdown-list-item, [role="menuitem"], .dropdown-item').allInnerTexts();
      console.log('Itens do menu Outros:', dropdownItems);
    }
  }

  // Verificar botões de toggle de colunas
  const toggleColBtn = await page.locator('[aria-label*="coluna" i], [title*="coluna" i], button:has-text("Colunas")').all();
  console.log('7. Botão toggle colunas encontrado:', toggleColBtn.length);

  // Verificar histórico (se existe modal de histórico de tramitações)
  const histBtn = page.locator('button[title*="histórico" i], a[title*="histórico" i], button:has-text("Histórico")');
  console.log('8. Botões de histórico na tela:', await histBtn.count());

  await browser.close();
})();
