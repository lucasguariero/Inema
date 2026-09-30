const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 9: Informacoes Adicionais e Exclusao', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para Minhas Emergências
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Abrir o registro 2026.000017/INEMA/RE
  const rowRe = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
  await rowRe.locator('a:has-text("Abrir"), button:has-text("Abrir"), a, button').last().click();
  await page.waitForTimeout(3000);

  console.log('RE aberto URL:', page.url());

  // Verificar se campos estão readonly / disabled e botão Finalizar ausente
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 25 - RE finalizada somente leitura.png' });
  console.log('✔ Print 25 capturado: RE somente leitura.');

  // Adicionar Informação Adicional 1
  console.log('Adicionando Informação Adicional 1...');
  const txtInfo = page.locator('textarea#form\\.info_texto, textarea[placeholder*="informação adicional"]').first();
  await txtInfo.scrollIntoViewIfNeeded();
  await txtInfo.fill('Equipe de contenção do Corpo de Bombeiros e Defesa Civil já acionadas no local.');
  await page.waitForTimeout(500);

  const btnSalvarInfo = page.locator('button:has-text("Registrar informação adicional")').first();
  await btnSalvarInfo.click();
  await page.waitForTimeout(3000);

  // Adicionar Informação Adicional 2
  console.log('Adicionando Informação Adicional 2...');
  await txtInfo.scrollIntoViewIfNeeded();
  await txtInfo.fill('Produto identificado como ácido sulfúrico em solução a 70%. Isolamento de 200 metros efetuado.');
  await page.waitForTimeout(500);

  await btnSalvarInfo.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 26 - Historico informacoes adicionais.png' });
  console.log('✔ Print 26 capturado: Histórico acumulativo de informações adicionais.');

  // Excluir Emergência
  console.log('Testando Exclusão da Emergência...');
  const btnExcluir = page.locator('button:has-text("Excluir Emergência")').first();
  await btnExcluir.scrollIntoViewIfNeeded();
  await btnExcluir.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 27 - Modal exclusao MSG007.png' });
  console.log('✔ Print 27 capturado: Modal de exclusão MSG007.');

  // Testar clicar em "Não" (ou Não, cancelar)
  const btnNao = page.locator('.fi-modal button:has-text("Não"), .fi-modal button:has-text("Cancelar")').first();
  if (await btnNao.isVisible().catch(() => false)) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    console.log('Clicado em Não, registro preservado.');
  }

  // Clicar em Excluir novamente e confirmar com Sim
  console.log('Confirmando exclusão com Sim...');
  await btnExcluir.scrollIntoViewIfNeeded();
  await btnExcluir.click();
  await page.waitForTimeout(1500);

  const btnSim = page.locator('.fi-modal button:has-text("Sim"), .fi-modal button:has-text("Confirmar"), .fi-modal button:has-text("Excluir")').first();
  await btnSim.click();
  await page.waitForTimeout(4000);

  // Verificar listagem
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 28 - Registro excluido com sucesso.png' });
  console.log('✔ Print 28 capturado: Registro excluído da listagem.');
});
