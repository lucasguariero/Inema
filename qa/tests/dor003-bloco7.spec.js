const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 7: Associar Tecnico', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar Fiscalização > Associar Técnico
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico', { waitUntil: 'networkidle' }).catch(async () => {
    await page.locator('text=Fiscalização').first().click();
    await page.waitForTimeout(500);
    await page.locator('text=Associar Técnico').first().click();
  });
  await page.waitForTimeout(2500);

  console.log('URL Associar Técnico:', page.url());

  // Localizar o registro 2026.000017/INEMA/RE
  const rowRe = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
  console.log('Linha do RE encontrada?', await rowRe.count());

  // Clicar em "Associar Técnico" ou botão de ação na linha
  const btnAssociar = rowRe.locator('button:has-text("Associar Técnico"), a:has-text("Associar"), button:has-text("Associar")').first();
  if (await btnAssociar.isVisible().catch(() => false)) {
    await btnAssociar.click();
  } else {
    // Tenta clicar no primeiro botão da linha que não seja ver
    await rowRe.locator('button, a').last().click();
  }
  await page.waitForTimeout(1500);

  // Inspecionar modal de técnicos
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 21 - Plantonistas ordenados no topo.png' });
  console.log('✔ Print 21 capturado: Modal de seleção de técnicos.');

  // Selecionar Bruno Carvalho no combobox/lista
  const selectTecnico = page.locator('.fi-modal select, .fi-modal button[role="combobox"], [role="dialog"] button[role="combobox"]').first();
  if (await selectTecnico.isVisible().catch(() => false)) {
    await selectTecnico.click();
    await page.waitForTimeout(800);

    const optBruno = page.locator('[role="option"]:has-text("Bruno Carvalho")').first();
    if (await optBruno.isVisible().catch(() => false)) {
      await optBruno.click();
      console.log('Bruno Carvalho selecionado.');
    } else {
      await page.locator('[role="option"]').first().click();
    }
  }

  // Salvar associação
  const btnSalvar = page.locator('.fi-modal button:has-text("Salvar"), .fi-modal button:has-text("Associar"), .fi-modal button:has-text("Confirmar")').first();
  if (await btnSalvar.isVisible().catch(() => false)) {
    await btnSalvar.click();
    await page.waitForTimeout(3000);
  }

  // Capturar listagem com status Análise Técnica
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 22 - Status Analise Tecnica.png' });
  console.log('✔ Print 22 capturado: Status Análise Técnica.');
});
