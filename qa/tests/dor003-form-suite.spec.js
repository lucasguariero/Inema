const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function setFilamentDate(page, inputId, dateIso) {
  await page.evaluate(({ id, val }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) {
      data.state = val;
    }
  }, { id: inputId, val: dateIso });
}

test('DOR003 - Formulario completo e validacoes visuais', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Anexo: Upload inválido com scroll
  console.log('1. Anexo inválido...');
  const dummyExe = path.resolve('qa/cards/card-03-emergencia-interna/arquivo-invalido.exe');
  const fileInput = page.locator('input.filepond--browser').first();
  await fileInput.setInputFiles(dummyExe);
  await page.waitForTimeout(1500);
  await page.locator('.filepond--root').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 11 - Recusa anexo invalido MSG005.png' });
  console.log('✔ Print 11 capturado.');

  // Remover arquivo inválido clicando em Remover se existir
  const btnRemover = page.locator('button:has-text("Remover"), .filepond--action-revert-item-processing').first();
  if (await btnRemover.isVisible().catch(() => false)) {
    await btnRemover.click();
    await page.waitForTimeout(500);
  }

  // Anexar PDF válido
  const dummyPdf = path.resolve('qa/cards/card-03-emergencia-interna/documento-valido.pdf');
  await fileInput.setInputFiles(dummyPdf);
  await page.waitForTimeout(2000);

  // 2. CEP 40020-000
  console.log('2. Testando CEP...');
  const cepInput = page.locator('input#form\\.cep');
  await cepInput.scrollIntoViewIfNeeded();
  await cepInput.fill('40020-000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 12 - Preenchimento automatico CEP.png' });
  console.log('✔ Print 12 capturado.');

  // 3. Áreas atingidas: selecionar 3 e tentar a 4ª
  console.log('3. Testando Áreas Atingidas...');
  const areas = ['Área Urbana', 'Área Industrial', 'Recurso Hídrico', 'Rodovia'];
  for (const a of areas) {
    const elArea = page.locator(`text="${a}"`).first();
    if (await elArea.isVisible().catch(() => false)) {
      await elArea.scrollIntoViewIfNeeded();
      await elArea.click();
      await page.waitForTimeout(400);
    }
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 13 - Limite 3 areas atingidas.png' });
  console.log('✔ Print 13 capturado.');

  // 4. Coordenadas: clicar em Incluir nova coordenada
  console.log('4. Testando Coordenadas...');
  const btnCoord = page.locator('button:has-text("Incluir nova coordenada")').first();
  if (await btnCoord.isVisible().catch(() => false)) {
    await btnCoord.scrollIntoViewIfNeeded();
    await btnCoord.click();
    await page.waitForTimeout(1000);

    // Inspecionar campos de coordenada que surgiram
    const coordInputs = await page.$$eval('input[placeholder*="Latitude"], input[placeholder*="Longitude"], input[id*="lat"], input[id*="long"], input[type="text"]', els =>
      els.filter(e => e.offsetParent !== null).map(e => ({ id: e.id, placeholder: e.placeholder }))
    );
    console.log('Coord inputs:', coordInputs);

    // Preencher latitude e longitude se encontrados
    const latInput = page.locator('input[placeholder*="Latitude"], input[id*="latitude"], input[id*="lat"]').first();
    const longInput = page.locator('input[placeholder*="Longitude"], input[id*="longitude"], input[id*="long"]').first();
    if (await latInput.isVisible().catch(() => false)) {
      await latInput.fill('-12.9777');
      await longInput.fill('-38.5016');
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 14 - Coordenadas preenchidas.png' });
    console.log('✔ Print 14 capturado.');
  }

  // 5. Comunicante
  console.log('5. Testando Comunicante e Vínculo com a empresa...');
  const radioNao = page.locator('#form\\.ind_vinculo_empresa-0, input[name="form.ind_vinculo_empresa"][value="0"]').first();
  await radioNao.scrollIntoViewIfNeeded();
  await radioNao.click();
  await page.waitForTimeout(800);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 15 - Dados comunicante vinculo Nao.png' });
  console.log('✔ Print 15 capturado.');
});
