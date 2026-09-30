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

test('DOR003 - Finalizacao e Validacoes MSG001 MSG002 MSG003 MSG004', async ({ page }) => {
  test.setTimeout(240000);

  // PDF válido garantido
  const dummyPdf = path.resolve('qa/cards/card-03-emergencia-interna/documento-valido.pdf');
  if (!fs.existsSync(dummyPdf)) {
    fs.writeFileSync(dummyPdf, '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n162\n%%EOF');
  }

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const reGerado = (await page.locator('.fi-header-heading, h2, h3, div:has-text("INEMA/RE")').filter({ hasText: /INEMA\/RE/ }).first().innerText()).trim();
  console.log('>>> RE DESTE REGISTRO:', reGerado);

  // TESTE 1: Tentar finalizar com campos obrigatórios vazios -> MSG001
  console.log('1. Testando finalização com campos vazios (MSG001)...');
  const btnFinalizar = page.locator('button:has-text("Finalizar Emergência")').first();
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 16 - Bloqueio campos obrigatorios MSG001.png' });
  console.log('✔ Print 16 capturado: Bloqueio MSG001.');

  // Preencher campos obrigatórios
  console.log('Preenchendo campos obrigatórios...');

  // Origem: Call Center
  await page.locator('button#form\\.origem').click();
  await page.waitForTimeout(600);
  await page.locator('[role="option"]:has-text("Call Center"), li:has-text("Call center")').first().click();
  await page.waitForTimeout(500);

  // Datas
  await setFilamentDate(page, 'form.data_hora_comunicado', '2026-09-15 10:00:00');
  await setFilamentDate(page, 'form.ocorrencia_inicio', '2026-09-15 08:30:00');
  await page.waitForTimeout(500);

  // Tipo: selecionar primeira opção de tipo válida
  await page.locator('button#form\\.tipo').click();
  await page.waitForTimeout(600);
  await page.locator('li[role="option"]:has-text("Acidente"), li:has-text("Acidente")').first().click();
  await page.waitForTimeout(500);

  // Descrição
  await page.locator('textarea#form\\.descricao').fill('Vazamento de substância tóxica em pista de rolamento com dispersão e risco à população local.');
  await page.waitForTimeout(500);

  // Anexo PDF
  await page.locator('input.filepond--browser').first().setInputFiles(dummyPdf);
  await page.waitForTimeout(2000);

  // CEP 40020-000
  const cepInput = page.locator('input#form\\.cep');
  await cepInput.scrollIntoViewIfNeeded();
  await cepInput.fill('40020-000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 12 - Preenchimento automatico CEP.png' });
  console.log('✔ Print 12 capturado: CEP.');

  // Endereço e ponto de referência
  await page.locator('input#form\\.numero').fill('100');
  await page.locator('textarea#form\\.ponto_referencia').fill('Próximo ao marco zero');

  // Áreas atingidas: 3 áreas
  const chks = page.locator('input[type="checkbox"]');
  const count = await chks.count();
  console.log('Checkboxes de áreas encontrados:', count);
  for (let i = 0; i < Math.min(3, count); i++) {
    await chks.nth(i).scrollIntoViewIfNeeded();
    await chks.nth(i).check();
    await page.waitForTimeout(200);
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 13 - Limite 3 areas atingidas.png' });
  console.log('✔ Print 13 capturado: 3 Áreas.');

  // Comunicante
  await page.locator('input#form\\.comunicante_nome').fill('Carlos Eduardo Silva');
  await page.locator('input#form\\.comunicante_telefone').fill('71988887777');

  // Vínculo = Não
  const radioNao = page.locator('#form\\.ind_vinculo_empresa-0').first();
  await radioNao.scrollIntoViewIfNeeded();
  await radioNao.click();
  await page.waitForTimeout(800);

  const txtEmpresa = page.locator('textarea[id*="empresa"], textarea[placeholder*="empresa"]').first();
  if (await txtEmpresa.isVisible().catch(() => false)) {
    await txtEmpresa.fill('Transportadora Transquímica Nordeste LTDA');
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 15 - Comunicante vinculo Nao empresa.png' });
  console.log('✔ Print 15 capturado: Comunicante.');

  // TESTE 2: Tentar finalizar sem coordenadas -> MSG002
  console.log('2. Testando finalização sem coordenadas (MSG002)...');
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 17 - Alerta sem coordenadas MSG002.png' });
  console.log('✔ Print 17 capturado: Alerta sem coordenadas.');

  // Fechar modal ou clicar em voltar/cancelar se abriu
  const btnCloseModal = page.locator('button:has-text("Cancelar"), button:has-text("Voltar"), .fi-modal-close-btn').first();
  if (await btnCloseModal.isVisible().catch(() => false)) {
    await btnCloseModal.click();
    await page.waitForTimeout(500);
  }

  // Preencher coordenadas
  console.log('Preenchendo Coordenadas Geográficas...');
  const btnCoord = page.locator('button:has-text("Incluir nova coordenada")').first();
  await btnCoord.scrollIntoViewIfNeeded();
  await btnCoord.click();
  await page.waitForTimeout(1000);

  const latInput = page.locator('input[placeholder*="-12"], input[id*="latitude"]').first();
  const longInput = page.locator('input[placeholder*="-38"], input[id*="longitude"]').first();
  if (await latInput.isVisible().catch(() => false)) {
    await latInput.fill('-12.9777');
    await longInput.fill('-38.5016');
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 14 - Coordenadas preenchidas.png' });
  console.log('✔ Print 14 capturado: Coordenadas.');

  // TESTE 3: Finalizar com confirmação MSG003: clicar Não
  console.log('3. Clicando em Finalizar -> Modal MSG003...');
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 18 - Modal confirmacao MSG003.png' });
  console.log('✔ Print 18 capturado: Modal confirmação.');

  // Clicar Não
  const btnNao = page.locator('.fi-modal button:has-text("Não"), button:has-text("Cancelar")').filter({ hasText: /^Não$|^Cancelar$/i }).first();
  if (await btnNao.isVisible().catch(() => false)) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 19 - Clicar Nao fecha modal.png' });
    console.log('✔ Print 19 capturado: Não fecha modal.');
  }

  // TESTE 4: Finalizar e confirmar com Sim -> MSG004
  console.log('4. Clicando em Finalizar e Confirmando com Sim (MSG004)...');
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  const btnSim = page.locator('.fi-modal button:has-text("Sim"), .fi-modal button:has-text("Confirmar"), button:has-text("Sim")').filter({ hasText: /^Sim$|^Confirmar$/i }).first();
  await btnSim.click();
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 20 - Emergencia finalizada com sucesso MSG004.png' });
  console.log('✔ Print 20 capturado: Emergência Finalizada com Sucesso!');
  console.log('URL APÓS FINALIZAR:', page.url());
});
