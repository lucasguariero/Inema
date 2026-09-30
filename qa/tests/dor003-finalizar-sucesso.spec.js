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

test('DOR003 - Finalizar Emergencia e Salvar RE', async ({ page }) => {
  test.setTimeout(180000);

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
  console.log('>>> NUMERO RE DO TESTE:', reGerado);

  // 1. Origem: Call Center
  await page.locator('button#form\\.origem').click();
  await page.waitForTimeout(600);
  await page.locator('[role="option"]:has-text("Call Center"), li:has-text("Call center")').first().click();
  await page.waitForTimeout(500);

  // 2. Datas
  await setFilamentDate(page, 'form.data_hora_comunicado', '2026-09-15 10:00:00');
  await setFilamentDate(page, 'form.ocorrencia_inicio', '2026-09-15 08:30:00');
  await page.waitForTimeout(500);

  // 3. Tipo
  await page.locator('button#form\\.tipo').click();
  await page.waitForTimeout(600);
  await page.locator('li[role="option"]:has-text("Acidente"), li:has-text("Acidente")').first().click();
  await page.waitForTimeout(500);

  // Descrição
  await page.locator('textarea#form\\.descricao').fill('Vazamento de produto químico corrosivo na rodovia com risco ambiental e contaminação de manancial.');
  await page.waitForTimeout(500);

  // 4. Anexo PDF
  await page.locator('input.filepond--browser').first().setInputFiles(dummyPdf);
  await page.waitForTimeout(2000);

  // 5. CEP 40020-000
  const cepInput = page.locator('input#form\\.cep');
  await cepInput.scrollIntoViewIfNeeded();
  await cepInput.fill('40020-000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(2500);

  // Número e Ponto de referência
  await page.locator('input#form\\.numero').fill('150');
  await page.locator('textarea#form\\.ponto_referencia').fill('Próximo à Praça da Sé e Elevador Lacerda');

  // 6. Áreas atingidas (3 áreas)
  const chks = page.locator('input[type="checkbox"]');
  const count = await chks.count();
  for (let i = 0; i < Math.min(3, count); i++) {
    await chks.nth(i).scrollIntoViewIfNeeded();
    await chks.nth(i).check();
    await page.waitForTimeout(150);
  }

  // 7. Comunicante
  await page.locator('input#form\\.comunicante_nome').fill('Carlos Eduardo Silva');
  await page.locator('input#form\\.comunicante_telefone').fill('71988887777');

  // Vínculo = Não
  const labelNao = page.locator('label:has-text("Não")').first();
  await labelNao.scrollIntoViewIfNeeded();
  await labelNao.click();
  await page.waitForTimeout(600);

  const txtEmpresa = page.locator('textarea[placeholder*="empresa"], textarea#form\\.empresa_nome').first();
  if (await txtEmpresa.isVisible().catch(() => false)) {
    await txtEmpresa.fill('Transportadora Transquímica Nordeste LTDA');
  }

  // 8. Teste finalização sem coordenadas -> MSG002
  console.log('Testando alerta MSG002 sem coordenadas...');
  const btnFinalizar = page.locator('button:has-text("Finalizar Emergência")').first();
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 17 - Alerta sem coordenadas MSG002.png' });
  console.log('✔ Print 17 capturado: Alerta sem coordenadas.');

  // Fechar modal clicando em "Voltar e informar"
  const btnVoltar = page.locator('button:has-text("Voltar e informar")').first();
  if (await btnVoltar.isVisible().catch(() => false)) {
    await btnVoltar.click();
    await page.waitForTimeout(800);
  }

  // 9. Preencher coordenadas
  console.log('Incluindo coordenadas...');
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

  // 10. Finalizar: Modal MSG003
  console.log('Clicando em Finalizar...');
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 18 - Modal confirmacao MSG003.png' });
  console.log('✔ Print 18 capturado: Modal de confirmação MSG003.');

  // Clicar Não
  const btnNao = page.locator('button:has-text("Não"), button:has-text("Cancelar")').filter({ hasText: /^Não$|^Cancelar$/i }).first();
  if (await btnNao.isVisible().catch(() => false)) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 19 - Clicar Nao mantem tela.png' });
    console.log('✔ Print 19 capturado: Clicar Não mantém tela.');
  }

  // Clicar Finalizar novamente e confirmar com Sim
  console.log('Confirmando finalização com Sim...');
  await btnFinalizar.click();
  await page.waitForTimeout(1500);

  const btnSim = page.locator('button:has-text("Sim"), button:has-text("Confirmar")').filter({ hasText: /^Sim$|^Confirmar$/i }).first();
  await btnSim.click();
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 20 - Emergencia finalizada com sucesso MSG004.png' });
  console.log('✔ Print 20 capturado: Emergência Finalizada com Sucesso!');
  console.log('URL APÓS FINALIZAR:', page.url());

  // Salvar o RE gerado em um arquivo de texto para as próximas etapas
  fs.writeFileSync('qa/cards/card-03-emergencia-interna/re-gerado.txt', reGerado);
});
