const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Gestor
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2500);

  // Ir para Associar Técnico
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico');
  await page.waitForTimeout(3000);

  const numeroRE = '2026.000004';
  console.log(`Buscando linha do RE ${numeroRE}...`);
  const linhaRE = page.locator(`tr:has-text("${numeroRE}")`);
  await linhaRE.scrollIntoViewIfNeeded();

  // Clicar no botão "Associar técnico" dentro da linha da tabela
  const btnAssociarLinha = linhaRE.locator('button:has-text("Associar técnico"), a:has-text("Associar técnico")');
  console.log('Botao associar na linha existe?', await btnAssociarLinha.count() > 0);
  await btnAssociarLinha.click();
  await page.waitForTimeout(1500);

  // Screenshot do modal
  await page.screenshot({ path: 'qa/screenshots/debug-modal-associar-aberto.png' });
  console.log('Modal de associar aberto!');

  // Inspecionar o select de técnicos
  const selectTecnico = page.locator('div[role="dialog"] button[role="combobox"], div.fi-modal button[role="combobox"]').first();
  console.log('Select de tecnico visivel?', await selectTecnico.isVisible());
  if (await selectTecnico.isVisible()) {
    await selectTecnico.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/screenshots/debug-lista-tecnicos.png' });
    
    // Obter as opcoes
    const options = await page.locator('[role="option"], .fi-select-input-option').allInnerTexts();
    console.log('Lista de técnicos disponíveis:');
    options.forEach((opt, idx) => console.log(` [${idx}] ${opt}`));

    // Clicar na primeira opcao
    const optFirst = page.locator('[role="option"], .fi-select-input-option').first();
    await optFirst.click();
    await page.waitForTimeout(500);
  }

  // Clicar em salvar associação
  const btnSalvar = page.locator('div[role="dialog"], div.fi-modal').getByRole('button', { name: /salvar|associar|confirmar/i }).last();
  console.log('Botao salvar modal:', await btnSalvar.innerText());
  await btnSalvar.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/screenshots/debug-pos-associar.png', fullPage: true });

  await browser.close();
})();
