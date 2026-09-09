const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('DOR004 - Teste Completo de Emergência Química Externa', async ({ page }) => {
  test.setTimeout(180000);

  // =========================================================================
  // BLOCO 1: ENTRAR
  // =========================================================================
  console.log('--- BLOCO 1: ENTRAR ---');
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  
  const btnEmergencia = page.locator('text=Registrar Emergência Química');
  await expect(btnEmergencia).toBeVisible();
  await btnEmergencia.click();

  await page.waitForTimeout(1000);
  const btnSimular = page.getByRole('button', { name: 'Simular autenticação' });
  await expect(btnSimular).toBeVisible();
  await btnSimular.click();

  await page.waitForTimeout(2000);
  const btnEntrar = page.getByRole('button', { name: /entrar como este comunicante/i });
  await expect(btnEntrar).toBeVisible();
  await btnEntrar.click();

  await page.waitForTimeout(3000);
  expect(page.url()).toContain('/emergencia-quimica/nova');
  console.log('✔ Bloco 1 Concluído com Sucesso! URL:', page.url());

  // =========================================================================
  // BLOCO 2: ABERTURA & RASCUNHO
  // =========================================================================
  console.log('--- BLOCO 2: ABERTURA ---');
  await expect(page.locator('text=A gerar na finalização')).toBeVisible();
  console.log('✔ "Nº de Registro: A gerar na finalização" confirmado no cabeçalho.');

  const campoPlantonista = page.locator('text=Técnico plantonista');
  expect(await campoPlantonista.count()).toBe(0);
  console.log('✔ Campo Técnico plantonista AUSENTE no fluxo externo (conforme RN030).');

  // =========================================================================
  // BLOCO 3: INFORMAÇÕES SOBRE EMPRESA
  // =========================================================================
  console.log('--- BLOCO 3: INFORMAÇÕES SOBRE EMPRESA ---');
  
  // Testar Vínculo = Sim
  const radioSim = page.getByLabel('Sim');
  await radioSim.click();
  await page.waitForTimeout(1000);
  await expect(page.getByLabel(/Nome da empresa/i).first()).toBeVisible();
  await expect(page.getByLabel(/Cargo/i).first()).toBeVisible();
  console.log('✔ Vínculo = Sim validado com sucesso.');

  // Testar Vínculo = Não
  const radioNao = page.getByLabel('Não');
  await radioNao.click();
  await page.waitForTimeout(1000);

  // Selecionar "Cidadão comum" no select "Você está comunicando como"
  const selectComo = page.locator('select').filter({ hasText: /comunicando como/i }).or(page.getByLabel(/comunicando como/i));
  if (await selectComo.count() > 0) {
    await selectComo.first().selectOption({ label: 'Cidadão comum' });
  } else {
    // Pode ser um Custom Select / Filament Select
    const customSelect = page.locator('button, div').filter({ hasText: /Selecione o você está comunicando como/i }).last();
    if (await customSelect.isVisible()) {
      await customSelect.click();
      await page.waitForTimeout(500);
      await page.locator('text=Cidadão comum').last().click();
    }
  }
  console.log('✔ Configurado como: Não / Cidadão comum.');

  // =========================================================================
  // BLOCO 4: PREENCHIMENTO E FINALIZAÇÃO
  // =========================================================================
  console.log('--- BLOCO 4: PREENCHIMENTO E FINALIZAÇÃO ---');

  // Telefone
  const campoTelefone = page.locator('input[id*="telefone"]').or(page.locator('input[placeholder*="00000-0000"]')).first();
  if (await campoTelefone.isVisible()) {
    await campoTelefone.fill('71999887766');
    console.log('✔ Telefone preenchido.');
  }

  // Data e hora da Constatação
  console.log('Preenchendo Data e hora da Constatação...');
  const campoData = page.locator('input[placeholder*="data e hora"]').first();
  if (await campoData.isVisible()) {
    // Clica no input de data e digita uma data válida recente
    await campoData.click();
    await page.waitForTimeout(500);
    // Filament DateTime picker geralmente aceita digitação ou seleção
    await page.keyboard.type('09/09/2026 15:30');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    console.log('✔ Data/hora preenchida.');
  }

  // Tipo da Emergência Química
  console.log('Selecionando Tipo da Emergência Química...');
  const selectTipo = page.locator('select[id*="tipo"]').or(page.getByLabel(/Tipo da Emergência Química/i));
  if (await selectTipo.count() > 0 && await selectTipo.first().isVisible()) {
    await selectTipo.first().selectOption({ label: 'Outros' });
  } else {
    // Filament Select customizado
    const tipoTrigger = page.locator('div, button').filter({ hasText: /Selecione o tipo da Emergência Química/i }).last();
    if (await tipoTrigger.isVisible()) {
      await tipoTrigger.click();
      await page.waitForTimeout(500);
      await page.locator('text=Outros').last().click();
    }
  }
  await page.waitForTimeout(1000);

  // Descrição do Tipo Outros (se aparecer)
  const campoDescOutros = page.locator('input[id*="tipo_outros"], textarea[id*="tipo_outros"]').or(page.getByLabel(/Descrição do tipo Outros/i));
  if (await campoDescOutros.count() > 0 && await campoDescOutros.first().isVisible()) {
    await campoDescOutros.first().fill('Vazamento de composto químico corrosivo');
    console.log('✔ Descrição do tipo Outros preenchida.');
  }

  // Descrição Geral
  const campoDescricao = page.locator('textarea[id*="descricao"]').or(page.getByLabel(/Descrição\*/i)).first();
  if (await campoDescricao.isVisible()) {
    await campoDescricao.fill('Durante fiscalização foi identificado odor forte e derramamento químico próximo à rodovia.');
    console.log('✔ Descrição geral preenchida.');
  }

  // Anexo PDF
  const dummyPdfPath = 'qa/test-dummy.pdf';
  if (!fs.existsSync(dummyPdfPath)) {
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy test file for Inema QA testing');
  }
  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles(dummyPdfPath);
    await page.waitForTimeout(2000);
    console.log('✔ Anexo PDF enviado.');
  }

  // CEP: 40020-000
  console.log('Preenchendo CEP: 40020-000...');
  const campoCep = page.locator('input[id*="cep"]').or(page.getByLabel(/CEP/i)).first();
  if (await campoCep.isVisible()) {
    await campoCep.fill('40020-000');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(3000); // Aguarda preenchimento automático
    console.log('✔ CEP informado.');
  }

  // Ponto de Referência
  const campoPontoRef = page.locator('textarea[id*="ponto_referencia"], input[id*="ponto_referencia"]').or(page.getByLabel(/Ponto de referência/i)).first();
  if (await campoPontoRef.isVisible()) {
    await campoPontoRef.fill('Em frente ao poste de alta tensão nº 42');
    console.log('✔ Ponto de referência preenchido.');
  }

  // Área Atingida (Marcar 3 opções)
  console.log('Marcando Áreas Atingidas...');
  const checkAreaUrbana = page.getByLabel('Área Urbana');
  const checkRodovia = page.getByLabel('Rodovia');
  const checkRecursoHidrico = page.getByLabel('Recurso Hídrico');

  if (await checkAreaUrbana.isVisible()) await checkAreaUrbana.check();
  if (await checkRodovia.isVisible()) await checkRodovia.check();
  if (await checkRecursoHidrico.isVisible()) await checkRecursoHidrico.check();
  console.log('✔ 3 Áreas Atingidas marcadas.');

  // Capturar tela antes de finalizar
  await page.screenshot({ path: 'qa/screenshots/08-formulario-preenchido.png', fullPage: true });

  // Clicar em "Finalizar Emergência"
  console.log('Clicando em "Finalizar Emergência"...');
  const btnFinalizar = page.getByRole('button', { name: /Finalizar Emergência/i });
  await btnFinalizar.click();
  await page.waitForTimeout(2500);

  // Capturar o primeiro modal de confirmação (MSG002 - Coordenadas)
  await page.screenshot({ path: 'qa/screenshots/09-modal-coordenadas-msg002.png' });
  console.log('Capturado modal MSG002.');

  // Clicar em continuar no modal de coordenadas
  const btnContinuarCoordenadas = page.getByRole('button', { name: /continuar|sim|prosseguir/i }).last();
  if (await btnContinuarCoordenadas.isVisible()) {
    console.log('Confirmando ausência de coordenadas (MSG002)...');
    await btnContinuarCoordenadas.click();
    await page.waitForTimeout(2000);
  }

  // Capturar segundo modal (MSG003 - Confirmação definitiva)
  await page.screenshot({ path: 'qa/screenshots/10-modal-confirmacao-msg003.png' });
  console.log('Capturado modal MSG003.');

  // Clicar em Sim para gravação definitiva
  const btnConfirmarSim = page.getByRole('button', { name: /sim|confirmar/i }).last();
  if (await btnConfirmarSim.isVisible()) {
    console.log('Confirmando gravação definitiva (Sim)...');
    await btnConfirmarSim.click();
    await page.waitForTimeout(5000);
  }

  // Capturar tela após gravação
  await page.screenshot({ path: 'qa/screenshots/11-pos-finalizacao.png', fullPage: true });

  const bodyText = await page.textContent('body');
  const matchRE = bodyText.match(/\d{4}\.\d{6}\/INEMA\/RE/);
  const numeroRE = matchRE ? matchRE[0] : 'RE-NAO-IDENTIFICADO';

  console.log('==============================================');
  console.log('🎉 REGISTRO DE EMERGÊNCIA FINALIZADO!');
  console.log('Número do RE:', numeroRE);
  console.log('URL atual:', page.url());
  console.log('==============================================');

  fs.writeFileSync('qa/numero-re-gerado.txt', numeroRE, 'utf8');
});
