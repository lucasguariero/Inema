const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 9: Abrir, Informacoes Adicionais e Exclusao', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para Minhas Emergências
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Localizar linha do registro
  const rowRe = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
  console.log('RE encontrado na listagem:', await rowRe.count());

  // 1. Clicar em ABRIR
  console.log('Clicando em Abrir...');
  const btnAbrir = rowRe.locator('a:has-text("Abrir"), button:has-text("Abrir"), [aria-label*="Abrir"]').first();
  await btnAbrir.click();
  await page.waitForTimeout(3000);

  console.log('URL RE aberto:', page.url());

  // Capturar tela do RE aberto em modo somente leitura
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 25 - RE finalizada somente leitura.png' });
  console.log('✔ Print 25 capturado: RE somente leitura.');

  // 2. Informações Adicionais
  console.log('Adicionando Informação Adicional 1...');
  const txtInfo = page.locator('textarea#form\\.info_texto, textarea[placeholder*="informação adicional"], textarea[placeholder*="Digite"]').first();
  if (await txtInfo.isVisible().catch(() => false)) {
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
    console.log('✔ Print 26 capturado: Histórico de informações adicionais.');
  }

  // 3. Excluir Emergência
  console.log('Testando exclusão...');
  // Pode excluir pelo botão na tela ou pela listagem
  const btnExcluirTela = page.locator('button:has-text("Excluir Emergência")').first();
  if (await btnExcluirTela.isVisible().catch(() => false)) {
    await btnExcluirTela.scrollIntoViewIfNeeded();
    await btnExcluirTela.click();
  } else {
    // Voltar para listagem e clicar no Excluir da linha
    await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const row = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
    await row.locator('button:has-text("Excluir"), a:has-text("Excluir")').first().click();
  }
  await page.waitForTimeout(1500);

  // Capturar modal MSG007
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 27 - Modal exclusao MSG007.png' });
  console.log('✔ Print 27 capturado: Modal de confirmação MSG007.');

  // Testar clicar em Não
  const btnNao = page.locator('.fi-modal button:has-text("Não")').first();
  if (await btnNao.isVisible().catch(() => false)) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    console.log('Clicou em Não, registro preservado.');
  }

  // Clicar em Excluir novamente e confirmar com Sim, excluir
  console.log('Confirmando exclusão...');
  if (await btnExcluirTela.isVisible().catch(() => false)) {
    await btnExcluirTela.click();
  } else {
    const row = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
    await row.locator('button:has-text("Excluir"), a:has-text("Excluir")').first().click();
  }
  await page.waitForTimeout(1500);

  const btnSim = page.locator('.fi-modal button:has-text("Sim, excluir"), .fi-modal button:has-text("Sim"), .fi-modal button:has-text("Confirmar")').first();
  await btnSim.click();
  await page.waitForTimeout(4000);

  // Ir para listagem e tirar print final comprovando exclusão
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-emergencias', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 28 - Registro excluido com sucesso.png' });
  console.log('✔ Print 28 capturado: Registro excluído da listagem.');
});
