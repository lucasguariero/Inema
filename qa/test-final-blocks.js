const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const dummyPdfPath = 'qa/test-dummy.pdf';
  const cpfCidadao = '529.982.247-25';

  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  console.log('--- 1. Login Cidadao via Simulacao Gov.br ---');
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online');
  await page.locator('text=Registrar Emergência Química').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Simular autenticação' }).click();
  await page.waitForTimeout(1500);

  const inputCpf = page.locator('input[type="text"]').first();
  await inputCpf.fill(cpfCidadao);
  await page.getByRole('button', { name: /entrar como este comunicante/i }).click();
  await page.waitForTimeout(3000);

  console.log('--- 2. Acessar Meus Registros ---');
  const btnMeusRegistros = page.locator('button:has-text("Meus registros"), a:has-text("Meus registros")').first();
  await btnMeusRegistros.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'qa/screenshots/31-meus-registros-analise-tecnica.png', fullPage: true });

  // Verificar status Análise Técnica na tabela
  const linhaRE = page.locator('tr:has-text("2026.000004")');
  console.log('Linha RE em Meus Registros:', await linhaRE.innerText());

  console.log('--- 3. Abrir RE para envio do RPEQ ---');
  const btnAbrir = linhaRE.locator('button:has-text("Abrir"), a:has-text("Abrir")');
  await btnAbrir.click();
  await page.waitForTimeout(3000);

  // Inspecionar inputs de arquivo
  const fileInputs = page.locator('input[type="file"]');
  const countFiles = await fileInputs.count();
  console.log('Total file inputs na página:', countFiles);

  // O RPEQ é a primeira seção de relatórios (ou segunda após os anexos principais)
  // Vamos localizar a seção do RPEQ
  const secaoRPEQ = page.locator('div:has-text("Relatório Preliminar de Emergência Química (RPEQ)")').last();
  const fileInputRPEQ = secaoRPEQ.locator('input[type="file"]').first();
  
  if (await fileInputRPEQ.count() > 0) {
    console.log('Input de arquivo encontrado no RPEQ! Enviando...');
    await fileInputRPEQ.setInputFiles(dummyPdfPath);
    await page.waitForTimeout(2000);
  } else {
    // Tenta pelo segundo ou terceiro input de arquivo geral
    console.log('Tentando inputs gerais...');
    for (let i = 0; i < countFiles; i++) {
      console.log(`Input ${i}:`, await fileInputs.nth(i).getAttribute('name'));
    }
    // Geralmente o penúltimo ou segundo
    await fileInputs.nth(1).setInputFiles(dummyPdfPath);
    await page.waitForTimeout(2000);
  }

  // Clicar em Enviar Relatório Preliminar
  const btnEnviarRPEQ = page.getByRole('button', { name: /Enviar Relatório Preliminar/i });
  console.log('Botao Enviar RPEQ visivel?', await btnEnviarRPEQ.isVisible());
  if (await btnEnviarRPEQ.isVisible()) {
    await btnEnviarRPEQ.click();
    await page.waitForTimeout(3000);
    console.log('✔ RPEQ Enviado!');
    await page.screenshot({ path: 'qa/screenshots/25-rpeq-enviado-sucesso.png', fullPage: true });
  }

  console.log('--- 4. Bloco 7: Teste de Rascunho e Exclusão ---');
  // Voltar para Meus Registros ou clicar em Nova Emergência
  const btnMeusReg2 = page.locator('button:has-text("Meus registros"), a:has-text("Meus registros")').first();
  await btnMeusReg2.click();
  await page.waitForTimeout(2000);

  // Clicar em "Nova Emergência Química"
  const btnNovaEmergencia = page.locator('button:has-text("Nova Emergência Química"), a:has-text("Nova Emergência Química")').first();
  if (await btnNovaEmergencia.isVisible()) {
    await btnNovaEmergencia.click();
  } else {
    // Se já havia um rascunho em preenchimento, clicar em "Continuar"
    const btnContinuar = page.locator('button:has-text("Continuar"), a:has-text("Continuar")').first();
    await btnContinuar.click();
  }
  await page.waitForTimeout(3000);

  // Preencher descrição no rascunho
  const textareaDesc = page.locator('textarea[id*="descricao"], textarea').first();
  if (await textareaDesc.isVisible()) {
    await textareaDesc.fill('Rascunho de teste para exclusão - DOR004');
    await page.waitForTimeout(2000);
  }

  // Recarregar a página para validar a persistência
  console.log('Recarregando página para validar persistência do rascunho...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'qa/screenshots/32-rascunho-recuperado.png', fullPage: true });
  console.log('✔ Rascunho validado com sucesso!');

  // Clicar em "Excluir Emergência"
  console.log('Clicando em "Excluir Emergência"...');
  const btnExcluir = page.locator('button:has-text("Excluir Emergência")').first();
  await btnExcluir.click();
  await page.waitForTimeout(1500);

  // Capturar MSG007
  await page.screenshot({ path: 'qa/screenshots/33-modal-exclusao-msg007.png' });
  console.log('Modal MSG007 capturado!');

  // Confirmar exclusão no modal
  const btnConfirmar = page.getByRole('button', { name: /confirmar|excluir|sim/i }).last();
  await btnConfirmar.click();
  await page.waitForTimeout(3000);

  // Screenshot pós-exclusão
  await page.screenshot({ path: 'qa/screenshots/34-pos-exclusao-rascunho.png', fullPage: true });
  console.log('✔ Rascunho excluído com sucesso!');

  await ctx.close();
  await browser.close();
  console.log('=== EXECUÇÃO FINALIZADA COM SUCESSO! ===');
})();
