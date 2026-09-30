const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 9: Informacoes e Exclusao', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar RE aberto
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia?emergencia=20', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Informação adicional 1
  console.log('1. Adicionando primeira informação adicional...');
  const txtInfo = page.locator('textarea#form\\.info_texto');
  await txtInfo.scrollIntoViewIfNeeded();
  await txtInfo.fill('Equipe de contenção do Corpo de Bombeiros e Defesa Civil já acionadas no local.');
  await page.waitForTimeout(500);

  const btnSalvar = page.locator('button:has-text("Registrar informação adicional")');
  await btnSalvar.click();
  await page.waitForTimeout(3000);

  // 2. Informação adicional 2
  console.log('2. Adicionando segunda informação adicional...');
  await txtInfo.scrollIntoViewIfNeeded();
  await txtInfo.fill('Produto identificado como ácido sulfúrico em solução a 70%. Isolamento de 200 metros efetuado.');
  await page.waitForTimeout(500);

  await btnSalvar.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 26 - Historico informacoes adicionais.png' });
  console.log('✔ Print 26 capturado: Histórico de informações adicionais.');

  // 3. Excluir Emergência
  console.log('3. Clicando em Excluir Emergência...');
  const btnExcluir = page.locator('button:has-text("Excluir Emergência")').first();
  await btnExcluir.scrollIntoViewIfNeeded();
  await btnExcluir.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 27 - Modal exclusao MSG007.png' });
  console.log('✔ Print 27 capturado: Modal de exclusão MSG007.');

  // Testar clicar em Não
  const btnNao = page.locator('.fi-modal button:has-text("Não")').first();
  if (await btnNao.isVisible().catch(() => false)) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    console.log('Clicou em Não, registro preservado.');
  }

  // Clicar em Excluir novamente e confirmar com Sim, excluir
  console.log('4. Confirmando exclusão definitiva...');
  await btnExcluir.scrollIntoViewIfNeeded();
  await btnExcluir.click();
  await page.waitForTimeout(1500);

  const btnSim = page.locator('.fi-modal button:has-text("Sim, excluir"), .fi-modal button:has-text("Sim")').first();
  await btnSim.click();
  await page.waitForTimeout(4000);

  // Ir para Minhas Emergências
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 28 - Registro excluido com sucesso.png' });
  console.log('✔ Print 28 capturado: Registro excluído da listagem.');
});
