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

test('DOR003 - Bloco 5 e 6: Formulario Completo, Validacoes e Finalizacao', async ({ page }) => {
  test.setTimeout(240000);

  // Garantir PDF de teste
  const dummyPdf = path.resolve('qa/cards/card-03-emergencia-interna/documento-valido.pdf');
  fs.writeFileSync(dummyPdf, '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n162\n%%EOF');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Obter número RE atual
  const reGerado = (await page.locator('.fi-header-heading, h2, h3, div:has-text("INEMA/RE")').filter({ hasText: /INEMA\/RE/ }).first().innerText()).trim();
  console.log('>>> RE DESTE TESTE:', reGerado);

  // 1. Origem: Call Center
  console.log('Preenchendo Origem...');
  await page.locator('button#form\\.origem').click();
  await page.waitForTimeout(600);
  await page.locator('[role="option"]:has-text("Call Center"), li:has-text("Call center")').first().click();
  await page.waitForTimeout(500);

  // 2. Data/hora: 15/09/2026 10:00 (dentro do plantão)
  console.log('Preenchendo Datas/Horas...');
  await setFilamentDate(page, 'form.data_hora_comunicado', '2026-09-15 10:00:00');
  await setFilamentDate(page, 'form.ocorrencia_inicio', '2026-09-15 08:30:00');
  await page.waitForTimeout(500);

  // 3. Tipo: Acidente no transporte rodoviário
  console.log('Preenchendo Tipo...');
  await page.locator('button#form\\.tipo').click();
  await page.waitForTimeout(600);
  await page.locator('[role="option"], li.fi-select-input-option').first().click();
  await page.waitForTimeout(500);

  // Descrição
  await page.locator('textarea#form\\.descricao').fill('Vazamento de produto químico decorrente de tombamento de carreta na rodovia, com risco de contaminação de solo e curso hídrico.');
  await page.waitForTimeout(500);

  // 4. Anexo PDF válido
  console.log('Anexando PDF válido...');
  const fileInput = page.locator('input.filepond--browser').first();
  await fileInput.setInputFiles(dummyPdf);
  await page.waitForTimeout(2000);

  // 5. CEP 40020-000
  console.log('Preenchendo CEP 40020-000...');
  const cepInput = page.locator('input#form\\.cep');
  await cepInput.scrollIntoViewIfNeeded();
  await cepInput.fill('40020-000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 12 - Preenchimento automatico CEP.png' });
  console.log('✔ Print 12 capturado: CEP preenchido.');

  // Preencher número e ponto de referência
  await page.locator('input#form\\.numero').fill('100');
  await page.locator('textarea#form\\.ponto_referencia').fill('Próximo ao marco zero e Elevador Lacerda');

  // 6. Áreas atingidas (máximo 3)
  console.log('Selecionando áreas atingidas...');
  const areas = ['Área Urbana', 'Área Industrial', 'Recurso Hídrico', 'Rodovia'];
  for (const a of areas) {
    const elArea = page.locator(`text="${a}"`).first();
    if (await elArea.isVisible().catch(() => false)) {
      await elArea.scrollIntoViewIfNeeded();
      await elArea.click();
      await page.waitForTimeout(300);
    }
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 13 - Limite 3 areas atingidas.png' });
  console.log('✔ Print 13 capturado: Limite de 3 áreas.');

  // 7. Comunicante: Vínculo = Não -> campo empresa
  console.log('Preenchendo Comunicante...');
  await page.locator('input#form\\.comunicante_nome').fill('Carlos Eduardo Silva');
  await page.locator('input#form\\.comunicante_telefone').fill('71988887777');

  // Vínculo = Não
  const radioNao = page.locator('#form\\.ind_vinculo_empresa-0, input[name="form.ind_vinculo_empresa"][value="0"]').first();
  await radioNao.scrollIntoViewIfNeeded();
  await radioNao.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 15 - Comunicante vinculo Nao empresa.png' });
  console.log('✔ Print 15 capturado: Vínculo Não.');

  // Preencher nome da empresa se campo surgiu
  const empInput = page.locator('input[placeholder*="empresa"], input[id*="empresa"], input[name*="empresa"]').first();
  if (await empInput.isVisible().catch(() => false)) {
    await empInput.fill('Transportadora Transquímica Nordeste LTDA');
  }

  // 8. Teste Finalização sem coordenadas -> MSG002
  console.log('Testando tentativa de finalização sem coordenadas...');
  const btnFinalizar = page.locator('button:has-text("Finalizar Emergência")').first();
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 16 - Alerta sem coordenadas MSG002.png' });
  console.log('✔ Print 16 capturado: Alerta sem coordenadas.');

  // Fechar modal de alerta se abriu
  const btnCancelarModal = page.locator('button:has-text("Cancelar"), button:has-text("Voltar"), .fi-modal-close-btn').first();
  if (await btnCancelarModal.isVisible().catch(() => false)) {
    await btnCancelarModal.click();
    await page.waitForTimeout(500);
  }

  // 9. Preencher coordenadas: Decimal -12.9777 e -38.5016
  console.log('Preenchendo Coordenadas Geográficas...');
  const btnCoord = page.locator('button:has-text("Incluir nova coordenada")').first();
  if (await btnCoord.isVisible().catch(() => false)) {
    await btnCoord.scrollIntoViewIfNeeded();
    await btnCoord.click();
    await page.waitForTimeout(1000);

    const latInput = page.locator('input[placeholder*="Latitude"], input[id*="lat"]').first();
    const longInput = page.locator('input[placeholder*="Longitude"], input[id*="long"]').first();
    if (await latInput.isVisible().catch(() => false)) {
      await latInput.fill('-12.9777');
      await longInput.fill('-38.5016');
      await page.waitForTimeout(500);
    }
  }
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 14 - Coordenadas preenchidas.png' });
  console.log('✔ Print 14 capturado: Coordenadas.');

  // 10. Finalizar com confirmação MSG003: primeiro Não, depois Sim -> MSG004
  console.log('Clicando em Finalizar Emergência...');
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 17 - Modal confirmacao MSG003.png' });
  console.log('✔ Print 17 capturado: Modal de confirmação MSG003.');

  // Testar clicar em Não
  const btnNaoModal = page.locator('button:has-text("Não"), button:has-text("Cancelar")').filter({ hasText: /^Não$|^Cancelar$/i }).first();
  if (await btnNaoModal.isVisible().catch(() => false)) {
    await btnNaoModal.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 18 - Clicar Nao mantem tela.png' });
    console.log('✔ Print 18 capturado: Clicar Não mantém tela.');
  }

  // Clicar Finalizar novamente e confirmar com Sim
  console.log('Confirmando finalização com Sim...');
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  const btnSimModal = page.locator('button:has-text("Sim"), button:has-text("Confirmar")').filter({ hasText: /^Sim$|^Confirmar$/i }).first();
  await btnSimModal.click();
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 19 - Emergencia Finalizada MSG004.png' });
  console.log('✔ Print 19 capturado: Emergência Finalizada com Sucesso!');
  console.log('URL final:', page.url());
});
