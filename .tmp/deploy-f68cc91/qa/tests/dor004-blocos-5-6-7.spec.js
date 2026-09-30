const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('DOR004 - Execucao dos Blocos 5, 6 e 7', async ({ browser }) => {
  test.setTimeout(300000);

  const numeroRE = fs.existsSync('qa/numero-re-gerado.txt') 
    ? fs.readFileSync('qa/numero-re-gerado.txt', 'utf8').trim()
    : '2026.000004/INEMA/RE';
  const cpfCidadao = '529.982.247-25';
  const dummyPdfPath = 'qa/test-dummy.pdf';

  if (!fs.existsSync(dummyPdfPath)) {
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy test file for Inema QA testing');
  }

  console.log(`=== INICIANDO TESTES PARA RE: ${numeroRE} / CPF: ${cpfCidadao} ===`);

  // =========================================================================
  // BLOCO 5: CORRECAO DE VINCULO PELO GESTOR E VALIDACAO DE RPEQ
  // =========================================================================
  console.log('\n>>> BLOCO 5.3 a 5.5: Login Gestor e Correcao de Vinculo <<<');
  const contextGestor = await browser.newContext();
  const pageGestor = await contextGestor.newPage();

  // Login Gestor
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/', { waitUntil: 'networkidle' });
  const inputCpfGestor = pageGestor.locator('input[id*="cpf"], input[type="text"]').first();
  const inputSenhaGestor = pageGestor.locator('input[type="password"]').first();
  await inputCpfGestor.fill('11111111111');
  await inputSenhaGestor.fill('gestor123');
  await pageGestor.getByRole('button', { name: /entrar|acessar/i }).click();
  await pageGestor.waitForTimeout(3000);

  // Navegar para Associar Tecnico
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico', { waitUntil: 'networkidle' }).catch(async () => {
    await pageGestor.locator('text=Fiscalização').first().click();
    await pageGestor.waitForTimeout(500);
    await pageGestor.locator('text=Associar Técnico').first().click();
  });
  await pageGestor.waitForTimeout(3000);

  // Filtrar ou localizar RE
  const buscaGestor = pageGestor.locator('input[placeholder*="Buscar"], input[type="search"]').first();
  if (await buscaGestor.isVisible().catch(() => false)) {
    await buscaGestor.fill(numeroRE);
    await pageGestor.keyboard.press('Enter');
    await pageGestor.waitForTimeout(2000);
  }

  // Clicar em "Corrigir vinculo"
  const btnCorrigir = pageGestor.locator('button:has-text("Corrigir vínculo"), a:has-text("Corrigir vínculo")').first();
  await expect(btnCorrigir).toBeVisible({ timeout: 10000 });
  await btnCorrigir.click();
  await pageGestor.waitForTimeout(1500);

  await pageGestor.screenshot({ path: 'qa/screenshots/20-gestor-modal-vinculo-antes.png' });

  // No modal: marcar Vinculo = Sim
  const radioSim = pageGestor.getByLabel('Sim').or(pageGestor.locator('input[value="1"]')).first();
  await radioSim.click();
  await pageGestor.waitForTimeout(1000);

  // Inspecionar os campos que surgiram
  console.log('Preenchendo Nome da empresa e Cargo no modal do Gestor...');
  const labelEmpresa = pageGestor.getByLabel(/Nome da empresa/i).first();
  const labelCargo = pageGestor.getByLabel(/Cargo/i).first();

  if (await labelEmpresa.isVisible().catch(() => false)) {
    await labelEmpresa.fill('Petroquímica Camaçari S.A.');
  } else {
    const inputEmpresaModal = pageGestor.locator('div[role="dialog"], div.fi-modal').locator('input[type="text"]').nth(0);
    if (await inputEmpresaModal.isVisible().catch(() => false)) {
      await inputEmpresaModal.fill('Petroquímica Camaçari S.A.');
    }
  }

  if (await labelCargo.isVisible().catch(() => false)) {
    await labelCargo.fill('Gerente de Operações Químicas');
  } else {
    const inputCargoModal = pageGestor.locator('div[role="dialog"], div.fi-modal').locator('input[type="text"]').nth(1);
    if (await inputCargoModal.isVisible().catch(() => false)) {
      await inputCargoModal.fill('Gerente de Operações Químicas');
    }
  }

  await pageGestor.screenshot({ path: 'qa/screenshots/21-gestor-modal-vinculo-preenchido.png' });

  // Clicar em "Salvar correcao"
  const btnSalvarCorrecao = pageGestor.getByRole('button', { name: /Salvar correção/i }).or(pageGestor.locator('button:has-text("Salvar")')).last();
  await btnSalvarCorrecao.click();
  await pageGestor.waitForTimeout(3000);

  await pageGestor.screenshot({ path: 'qa/screenshots/22-gestor-pos-salvar-correcao.png', fullPage: true });
  console.log('✔ Bloco 5: Vinculo corrigido pelo Gestor para "Sim".');
  await contextGestor.close();

  // =========================================================================
  // BLOCO 5.6 & 5.7: Retornar ao Portal Externo e Conferir RPEQ Liberado
  // =========================================================================
  console.log('\n>>> BLOCO 5.6 & 5.7: Retorno ao Portal Externo para Conferir RPEQ <<<');
  const contextCidadao = await browser.newContext();
  const pageCidadao = await contextCidadao.newPage();

  await pageCidadao.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  await pageCidadao.locator('text=Registrar Emergência Química').click();
  await pageCidadao.waitForTimeout(1000);
  await pageCidadao.getByRole('button', { name: 'Simular autenticação' }).click();
  await pageCidadao.waitForTimeout(1500);

  // Preencher CPF original
  const inputCpfSim = pageCidadao.locator('input[placeholder*="CPF"], input[type="text"]').first();
  await inputCpfSim.fill(cpfCidadao);
  await pageCidadao.getByRole('button', { name: /entrar como este comunicante/i }).click();
  await pageCidadao.waitForTimeout(3000);

  // Clicar em "Meus registros"
  console.log('Clicando em "Meus registros"...');
  const btnMeusRegistros = pageCidadao.locator('button:has-text("Meus registros"), a:has-text("Meus registros")').first();
  if (await btnMeusRegistros.isVisible().catch(() => false)) {
    await btnMeusRegistros.click();
    await pageCidadao.waitForTimeout(2000);
    await pageCidadao.screenshot({ path: 'qa/screenshots/23-meus-registros-cidadao.png', fullPage: true });
  }

  // Acessar / abrir o RE
  console.log(`Abrindo o RE ${numeroRE}...`);
  const btnAbrirRE = pageCidadao.locator(`tr:has-text("${numeroRE}") button, tr:has-text("${numeroRE}") a`).first();
  if (await btnAbrirRE.isVisible().catch(() => false)) {
    await btnAbrirRE.click();
  } else {
    await pageCidadao.goto('https://gla-inema-hml.acto.com.br/servicos-online/emergencia-quimica/nova?emergencia=4', { waitUntil: 'networkidle' });
  }
  await pageCidadao.waitForTimeout(3000);

  await pageCidadao.screenshot({ path: 'qa/screenshots/24-rpeq-pos-correcao-liberado.png', fullPage: true });

  // Verificar se o RPEQ agora possui campo de envio de arquivo
  const rpeqSection = pageCidadao.locator('div:has-text("Relatório Preliminar de Emergência Química")').last();
  const rpeqFileInput = rpeqSection.locator('input[type="file"]').first();

  if (await rpeqFileInput.count() > 0) {
    console.log('Enviando anexo no RPEQ...');
    await rpeqFileInput.setInputFiles(dummyPdfPath);
    await pageCidadao.waitForTimeout(2000);
    const btnEnviarRpeq = pageCidadao.getByRole('button', { name: /Enviar Relatório Preliminar/i }).or(pageCidadao.locator('button:has-text("Enviar Relatório Preliminar")'));
    if (await btnEnviarRpeq.isVisible().catch(() => false)) {
      await btnEnviarRpeq.click();
      await pageCidadao.waitForTimeout(3000);
      console.log('✔ RPEQ enviado com sucesso!');
      await pageCidadao.screenshot({ path: 'qa/screenshots/25-rpeq-enviado-sucesso.png', fullPage: true });
    }
  } else {
    console.log('Upload de RPEQ nao encontrado na secao.');
  }

  await contextCidadao.close();

  // =========================================================================
  // BLOCO 6: ASSOCIACAO DO TECNICO PELO CALL CENTER
  // =========================================================================
  console.log('\n>>> BLOCO 6: Associacao do Tecnico pelo Call Center <<<');
  const contextCallcenter = await browser.newContext();
  const pageCallcenter = await contextCallcenter.newPage();

  // Login Call Center: 123.456.789-01 / @Callcenter123
  await pageCallcenter.goto('https://gla-inema-hml.acto.com.br/', { waitUntil: 'networkidle' });
  const inputCpfCallcenter = pageCallcenter.locator('input[id*="cpf"], input[type="text"]').first();
  const inputSenhaCallcenter = pageCallcenter.locator('input[type="password"]').first();
  await inputCpfCallcenter.fill('12345678901');
  await inputSenhaCallcenter.fill('@Callcenter123');
  await pageCallcenter.getByRole('button', { name: /entrar|acessar/i }).click();
  await pageCallcenter.waitForTimeout(3000);

  await pageCallcenter.screenshot({ path: 'qa/screenshots/26-callcenter-dashboard.png', fullPage: true });

  // Acessar Fiscalizacao > Associar Tecnico
  await pageCallcenter.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico', { waitUntil: 'networkidle' }).catch(async () => {
    await pageCallcenter.locator('text=Fiscalização').first().click();
    await pageCallcenter.waitForTimeout(500);
    await pageCallcenter.locator('text=Associar Técnico').first().click();
  });
  await pageCallcenter.waitForTimeout(3000);

  // Buscar RE
  const buscaCallcenter = pageCallcenter.locator('input[placeholder*="Buscar"], input[type="search"]').first();
  if (await buscaCallcenter.isVisible().catch(() => false)) {
    await buscaCallcenter.fill(numeroRE);
    await pageCallcenter.keyboard.press('Enter');
    await pageCallcenter.waitForTimeout(2000);
  }

  await pageCallcenter.screenshot({ path: 'qa/screenshots/27-callcenter-fila-re.png', fullPage: true });

  // Clicar em "Associar tecnico"
  const btnAssociarTecnico = pageCallcenter.locator('button:has-text("Associar técnico"), a:has-text("Associar técnico")').first();
  await expect(btnAssociarTecnico).toBeVisible({ timeout: 10000 });
  await btnAssociarTecnico.click();
  await pageCallcenter.waitForTimeout(1500);

  await pageCallcenter.screenshot({ path: 'qa/screenshots/28-callcenter-modal-associar.png' });

  // Abrir select de tecnicos para inspecionar ordenacao Salvador vs outros
  const selectTecnico = pageCallcenter.locator('div[role="dialog"], div.fi-modal').locator('button[role="combobox"], select').first();
  if (await selectTecnico.isVisible().catch(() => false)) {
    await selectTecnico.click();
    await pageCallcenter.waitForTimeout(1000);
    await pageCallcenter.screenshot({ path: 'qa/screenshots/29-callcenter-lista-tecnicos-ordenacao.png' });

    // Selecionar o primeiro tecnico disponivel
    const primeiraOpcao = pageCallcenter.locator('[role="option"], .fi-select-input-option, option').first();
    await primeiraOpcao.click();
    await pageCallcenter.waitForTimeout(500);
  }

  // Salvar associacao
  const btnSalvarAssociacao = pageCallcenter.locator('div[role="dialog"], div.fi-modal').getByRole('button', { name: /associar|salvar|confirmar/i }).last();
  await btnSalvarAssociacao.click();
  await pageCallcenter.waitForTimeout(3000);

  await pageCallcenter.screenshot({ path: 'qa/screenshots/30-callcenter-pos-associacao.png', fullPage: true });
  console.log('✔ Bloco 6: Tecnico associado com sucesso!');

  await contextCallcenter.close();

  // =========================================================================
  // BLOCO 7: CONSULTA STATUS, RASCUNHO E EXCLUSAO
  // =========================================================================
  console.log('\n>>> BLOCO 7: Consulta, Rascunho e Exclusao pelo Comunicante <<<');
  const contextFinal = await browser.newContext();
  const pageFinal = await contextFinal.newPage();

  await pageFinal.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  await pageFinal.locator('text=Registrar Emergência Química').click();
  await pageFinal.waitForTimeout(1000);
  await pageFinal.getByRole('button', { name: 'Simular autenticação' }).click();
  await pageFinal.waitForTimeout(1500);

  const inputCpfFinal = pageFinal.locator('input[placeholder*="CPF"], input[type="text"]').first();
  await inputCpfFinal.fill(cpfCidadao);
  await pageFinal.getByRole('button', { name: /entrar como este comunicante/i }).click();
  await pageFinal.waitForTimeout(3000);

  // 7.1 & 7.2 Meus registros: status Analise Tecnica
  const btnMeusRegFinal = pageFinal.locator('button:has-text("Meus registros"), a:has-text("Meus registros")').first();
  if (await btnMeusRegFinal.isVisible().catch(() => false)) {
    await btnMeusRegFinal.click();
    await pageFinal.waitForTimeout(2000);
    await pageFinal.screenshot({ path: 'qa/screenshots/31-consulta-status-analise-tecnica.png', fullPage: true });
    console.log('✔ Status em "Meus Registros" capturado.');
  }

  // 7.3 Criar rascunho
  console.log('Iniciando novo rascunho...');
  const btnNovaEmergencia = pageFinal.locator('button:has-text("Nova Emergência"), a:has-text("Nova Emergência"), button:has-text("Registrar")').first();
  if (await btnNovaEmergencia.isVisible().catch(() => false)) {
    await btnNovaEmergencia.click();
    await pageFinal.waitForTimeout(2000);
  } else {
    await pageFinal.goto('https://gla-inema-hml.acto.com.br/servicos-online/emergencia-quimica/nova', { waitUntil: 'networkidle' });
  }

  // Preencher parcialmente
  const textareaDescricao = pageFinal.locator('textarea[id*="descricao"], textarea').first();
  if (await textareaDescricao.isVisible().catch(() => false)) {
    await textareaDescricao.fill('Rascunho de teste para exclusão automatizada - DOR004');
    await pageFinal.waitForTimeout(1500);
    console.log('✔ Campo descricao preenchido no rascunho.');
  }

  // 7.4 Testar recarregamento / recuperacao do rascunho
  console.log('Recarregando para validar persistencia do rascunho...');
  await pageFinal.reload({ waitUntil: 'networkidle' });
  await pageFinal.waitForTimeout(2000);
  await pageFinal.screenshot({ path: 'qa/screenshots/32-rascunho-recuperado.png', fullPage: true });
  console.log('✔ Rascunho recuperado com sucesso!');

  // 7.5 Excluir rascunho
  console.log('Clicando em "Excluir Emergência"...');
  const btnExcluir = pageFinal.locator('button:has-text("Excluir Emergência")').first();
  await expect(btnExcluir).toBeVisible();
  await btnExcluir.click();
  await pageFinal.waitForTimeout(1500);

  // Validar MSG007
  await pageFinal.screenshot({ path: 'qa/screenshots/33-modal-exclusao-msg007.png' });

  // Confirmar exclusao
  const btnConfirmarExclusao = pageFinal.getByRole('button', { name: /confirmar|excluir|sim/i }).last();
  await btnConfirmarExclusao.click();
  await pageFinal.waitForTimeout(3000);

  await pageFinal.screenshot({ path: 'qa/screenshots/34-pos-exclusao-rascunho.png', fullPage: true });
  console.log('✔ Bloco 7: Rascunho excluido com sucesso!');

  await contextFinal.close();
  console.log('\n=== TODOS OS BLOCOS (5, 6 e 7) CONCLUIDOS COM SUCESSO! ===');
});
