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

test('DOR003 - Bloco 4 e 5: Formulario e Validacoes Iniciais', async ({ page }) => {
  test.setTimeout(180000);
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/nova-emergencia', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Origem: conferir as 8 opções
  console.log('1. Verificando opções do campo Origem...');
  await page.locator('button#form\\.origem').click();
  await page.waitForTimeout(800);
  const opcoesOrigem = await page.locator('[role="option"], li.fi-select-input-option').allInnerTexts();
  console.log('Opções de Origem:', opcoesOrigem);
  // Selecionar Call Center
  await page.locator('[role="option"]:has-text("Call Center"), li:has-text("Call Center")').first().click();
  await page.waitForTimeout(500);

  // 2. Data futura
  console.log('2. Testando data futura...');
  await setFilamentDate(page, 'form.data_hora_comunicado', '2030-12-31 10:00:00');
  await setFilamentDate(page, 'form.ocorrencia_inicio', '2030-12-31 10:00:00');
  await page.waitForTimeout(500);
  await page.locator('h1:has-text("Nova Emergência Química")').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 09 - Recusa data futura.png' });
  console.log('✔ Print 09 capturado.');

  // Corrigir para data válida no plantão: 15/09/2026 10:00
  await setFilamentDate(page, 'form.data_hora_comunicado', '2026-09-15 10:00:00');
  await setFilamentDate(page, 'form.ocorrencia_inicio', '2026-09-15 08:30:00');
  await page.waitForTimeout(500);

  // 3. Tipo: Outros -> descrição livre
  console.log('3. Testando Tipo Outros...');
  await page.locator('button#form\\.tipo').click();
  await page.waitForTimeout(800);
  await page.locator('[role="option"]:has-text("Outros"), li:has-text("Outros")').first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 10 - Tipo Outros descricao obrigatoria.png' });
  console.log('✔ Print 10 capturado.');

  // Trocar para outro tipo (ex: Vazamento)
  await page.locator('button#form\\.tipo').click();
  await page.waitForTimeout(800);
  await page.locator('[role="option"]:not(:has-text("Outros"))').first().click();
  await page.waitForTimeout(800);

  // 4. Anexo: testar não-PDF (criar dummy txt e png)
  console.log('4. Testando recusa de anexo não-PDF...');
  const dummyTxt = path.resolve('qa/cards/card-03-emergencia-interna/teste-invalido.txt');
  fs.writeFileSync(dummyTxt, 'Arquivo de texto invalido');
  const dummyPdf = path.resolve('qa/cards/card-03-emergencia-interna/documento-valido.pdf');
  fs.writeFileSync(dummyPdf, '%PDF-1.4\n%EOF\n');

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(dummyTxt);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 11 - Recusa anexo nao PDF MSG005.png' });
  console.log('✔ Print 11 capturado.');

  // Anexar PDF válido
  await fileInput.setInputFiles(dummyPdf);
  await page.waitForTimeout(2000);

  // 5. CEP: 40020-000
  console.log('5. Testando preenchimento automático por CEP...');
  await page.locator('input#form\\.cep').fill('40020-000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 12 - Preenchimento automatico CEP.png' });
  console.log('✔ Print 12 capturado.');
});
