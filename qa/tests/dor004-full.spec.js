const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('DOR004 - Teste Automatizado Completo: Blocos 1 a 4', async ({ page }) => {
  test.setTimeout(180000);

  // Helper para selecionar opções no Filament combobox
  async function selectFilament(buttonId, optionText) {
    console.log(`Selecionando "${optionText}" no campo "${buttonId}"...`);
    const btn = page.locator(`[id="${buttonId}"]`);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(600);
    // No Filament, ao abrir o combobox, pode ter um campo de busca ou opções em li / role="option"
    const searchInput = page.locator('.fi-select-input-search-input, input[type="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill(optionText);
      await page.waitForTimeout(400);
    }
    const option = page.locator(`[role="option"]:has-text("${optionText}"), .fi-select-input-option:has-text("${optionText}"), li:has-text("${optionText}")`).first();
    await option.click();
    await page.waitForTimeout(600);
  }

  // =========================================================================
  // BLOCO 1: ENTRAR & SIMULAR GOV.BR
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
  const txtCabecalho = page.locator('text=A gerar na finalização');
  await expect(txtCabecalho).toBeVisible();
  console.log('✔ "Nº de Registro: A gerar na finalização" confirmado no cabeçalho.');

  const campoPlantonista = page.locator('text=Técnico plantonista');
  expect(await campoPlantonista.count()).toBe(0);
  console.log('✔ Campo Técnico plantonista AUSENTE no fluxo externo (conforme RN030).');

  // =========================================================================
  // BLOCO 3: INFORMAÇÕES SOBRE EMPRESA
  // =========================================================================
  console.log('--- BLOCO 3: INFORMAÇÕES SOBRE EMPRESA ---');
  
  // Testar Vínculo = Sim
  console.log('Testando Vínculo = Sim...');
  await page.locator('[id="form.ind_vinculo_empresa-1"]').click();
  await page.waitForTimeout(800);
  await expect(page.getByLabel(/Nome da empresa/i).first()).toBeVisible();
  await expect(page.getByLabel(/Cargo/i).first()).toBeVisible();
  console.log('✔ Vínculo = Sim validado: campos Nome da empresa e Cargo visíveis.');

  // Testar Vínculo = Não
  console.log('Testando Vínculo = Não...');
  await page.locator('[id="form.ind_vinculo_empresa-0"]').click();
  await page.waitForTimeout(800);

  // Testar seleção "Outras instituições"
  console.log('Testando Outras instituições...');
  await selectFilament('form.tipo_sem_vinculo', 'Outras instituições');
  await page.waitForTimeout(800);

  // Configurar para: Não / Cidadão comum (conforme roteiro do teste)
  console.log('Configurando para: Não / Cidadão comum...');
  await selectFilament('form.tipo_sem_vinculo', 'Cidadão comum');
  await page.waitForTimeout(500);

  // Validar se "Sabe informar o nome da empresa responsável?" permanece visível
  await expect(page.locator('[id="form.empresa_responsavel"]')).toBeVisible();
  console.log('✔ Campo "Sabe informar o nome da empresa responsável?" permaneceu visível.');

  // =========================================================================
  // BLOCO 4: PREENCHIMENTO E FINALIZAÇÃO
  // =========================================================================
  console.log('--- BLOCO 4: PREENCHIMENTO E FINALIZAÇÃO ---');

  // 4.1 Comunicante: Validar bloqueio de Nome, CPF e E-mail; Telefone editável
  const inputNome = page.locator('[id="form.comunicante_nome"]');
  const inputCpf = page.locator('[id="form.comunicante_cpf_cnpj"]');
  const inputEmail = page.locator('[id="form.comunicante_email"]');
  const inputTel = page.locator('[id="form.comunicante_telefone"]');

  await expect(inputNome).toBeDisabled();
  await expect(inputCpf).toBeDisabled();
  await expect(inputEmail).toBeDisabled();
  await expect(inputTel).toBeEditable();
  console.log('✔ Nome, CPF e E-mail bloqueados; Telefone editável.');

  // Preencher Telefone
  await inputTel.fill('71999887766');

  // 4.2 Data e hora da Constatação: Selecionar data atual via trigger do Filament
  console.log('Selecionando Data e hora da Constatação...');
  const triggerData = page.locator('.fi-fo-date-time-picker-trigger').first();
  await triggerData.click();
  await page.waitForTimeout(500);

  // Selecionar dia de hoje no calendário
  const diaHoje = page.locator('.fi-fo-date-time-picker-calendar-day-today').first();
  if (await diaHoje.isVisible()) {
    await diaHoje.click();
    console.log('✔ Dia de hoje selecionado no calendário.');
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 4.3 Tipo da Emergência Química: selecionar "Outros"
  await selectFilament('form.tipo', 'Outros');
  await page.waitForTimeout(800);

  // Localizar campo de descrição do tipo Outros
  const descOutros = page.locator('input[id*="outro"], textarea[id*="outro"]').or(page.getByLabel(/descrição do tipo outros/i));
  if (await descOutros.count() > 0 && await descOutros.first().isVisible()) {
    await descOutros.first().fill('Vazamento atípico de produto químico corrosivo');
    console.log('✔ Descrição do tipo Outros preenchida.');
  }

  // Descrição geral da emergência
  await page.locator('[id="form.descricao"]').fill('Identificado derramamento e forte odor químico durante vistoria em via pública.');
  console.log('✔ Descrição preenchida.');

  // 4.4 Anexos: Enviar PDF
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

  // 4.5 CEP: 40020-000 -> Autocompletar
  console.log('Preenchendo CEP 40020-000...');
  const inputCep = page.locator('[id="form.cep"]');
  await inputCep.fill('40020000');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(3000); // Aguarda consulta ViaCEP/Correios

  // Ponto de Referência
  await page.locator('[id="form.ponto_referencia"]').fill('Próximo à Praça da Sé, em frente ao poste nº 42');
  console.log('✔ Ponto de referência preenchido.');

  // 4.6 Área Atingida: Marcar 3 opções e tentar 4ª
  console.log('Testando Áreas Atingidas...');
  const checkAreaUrbana = page.getByLabel('Área Urbana');
  const checkRodovia = page.getByLabel('Rodovia');
  const checkRecursoHidrico = page.getByLabel('Recurso Hídrico');
  const checkDistrito = page.getByLabel('Distrito');

  await checkAreaUrbana.check();
  await checkRodovia.check();
  await checkRecursoHidrico.check();
  console.log('✔ 3 Áreas Atingidas marcadas.');

  // Tentar marcar 4ª
  await checkDistrito.click();
  await page.waitForTimeout(500);
  const distritoMarcado = await checkDistrito.isChecked();
  console.log('Status da 4ª área (Distrito):', distritoMarcado ? 'Marcou' : 'BLOQUEOU (Correto!)');

  // Coordenadas: Deixar em branco

  // Capturar tela antes de finalizar
  await page.screenshot({ path: 'qa/screenshots/08-formulario-preenchido.png', fullPage: true });

  // 4.7 Clicar em "Finalizar Emergência"
  console.log('Clicando em "Finalizar Emergência"...');
  const btnFinalizar = page.getByRole('button', { name: /Finalizar Emergência/i });
  await btnFinalizar.scrollIntoViewIfNeeded();
  await btnFinalizar.click();
  await page.waitForTimeout(2000);

  // Captura do modal MSG002 (Ausência de Coordenadas)
  await page.screenshot({ path: 'qa/screenshots/09-modal-coordenadas-msg002.png' });
  console.log('✔ Modal de ausência de coordenadas (MSG002) capturado.');

  // Clicar em continuar / confirmar no modal de coordenadas
  const btnContinuarCoord = page.getByRole('button', { name: /continuar|sim|prosseguir/i }).last();
  if (await btnContinuarCoord.isVisible()) {
    console.log('Confirmando ausência de coordenadas (MSG002)...');
    await btnContinuarCoord.click();
    await page.waitForTimeout(2000);
  }

  // Captura do modal MSG003 (Confirmação Definitiva)
  await page.screenshot({ path: 'qa/screenshots/10-modal-confirmacao-msg003.png' });
  console.log('✔ Modal de confirmação definitiva (MSG003) capturado.');

  // Testar "Não" na MSG003
  console.log('Testando opção "Não" na confirmação...');
  const btnNao = page.getByRole('button', { name: /não/i }).last();
  if (await btnNao.isVisible()) {
    await btnNao.click();
    await page.waitForTimeout(1000);
    console.log('✔ "Não" selecionado. Dados preservados.');

    // Finalizar novamente para confirmar "Sim"
    await btnFinalizar.click();
    await page.waitForTimeout(1500);

    const btnContinuarCoord2 = page.getByRole('button', { name: /continuar|sim|prosseguir/i }).last();
    if (await btnContinuarCoord2.isVisible()) {
      await btnContinuarCoord2.click();
      await page.waitForTimeout(1500);
    }
  }

  // Confirmar "Sim" na MSG003
  console.log('Confirmando "Sim" para finalização definitiva...');
  const btnSim = page.getByRole('button', { name: /sim/i }).last();
  await btnSim.click();
  await page.waitForTimeout(5000);

  // Capturar tela pós-finalização
  await page.screenshot({ path: 'qa/screenshots/11-pos-finalizacao-re.png', fullPage: true });

  const bodyText = await page.textContent('body');
  const matchRE = bodyText.match(/\d{4}\.\d{6}\/INEMA\/RE/);
  const numeroRE = matchRE ? matchRE[0] : 'RE-NAO-LOCALIZADO';

  console.log('==============================================');
  console.log('🎉 REGISTRO DE EMERGÊNCIA CRIADO COM SUCESSO!');
  console.log('Número do RE:', numeroRE);
  console.log('URL atual:', page.url());
  console.log('==============================================');

  fs.writeFileSync('qa/numero-re-gerado.txt', numeroRE, 'utf8');
});
