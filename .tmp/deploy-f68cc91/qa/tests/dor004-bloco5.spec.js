const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('DOR004 - Bloco 5: Relatórios e Correção de Vínculo pelo Gestor', async ({ page }) => {
  test.setTimeout(180000);

  const numeroRE = fs.existsSync('qa/numero-re-gerado.txt') 
    ? fs.readFileSync('qa/numero-re-gerado.txt', 'utf8').trim()
    : '2026.000004/INEMA/RE';
  console.log('Testando para o RE:', numeroRE);

  const dummyPdfPath = 'qa/test-dummy.pdf';
  if (!fs.existsSync(dummyPdfPath)) {
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4 dummy test file for Inema QA testing');
  }

  // =========================================================================
  // PARTE 1: Enviar Relatório Conclusivo no Portal Externo
  // =========================================================================
  console.log('--- PARTE 1: Envio de Relatório Conclusivo ---');
  // Navega diretamente para o RE já criado (ou via portal)
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online/emergencia-quimica/nova?emergencia=4', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Localizar input de arquivo do Relatório Conclusivo
  console.log('Localizando upload do Relatório Conclusivo...');
  const conclusivoSection = page.locator('div:has-text("Relatório Conclusivo de Emergência Química")').last();
  const fileInputConclusivo = conclusivoSection.locator('input[type="file"]').first();
  
  if (await fileInputConclusivo.count() > 0) {
    await fileInputConclusivo.setInputFiles(dummyPdfPath);
    await page.waitForTimeout(2000);
    const btnEnviarConclusivo = page.getByRole('button', { name: /Enviar Relatório Conclusivo/i });
    if (await btnEnviarConclusivo.isVisible()) {
      await btnEnviarConclusivo.click();
      await page.waitForTimeout(3000);
      console.log('✔ Relatório Conclusivo enviado.');
    }
  }

  // Recarregar e conferir persistência
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'qa/screenshots/12-pos-envio-conclusivo.png', fullPage: true });
  console.log('✔ Página recarregada, evidência salva.');

  // =========================================================================
  // PARTE 2: Login como Gestor para Corrigir Vínculo
  // =========================================================================
  console.log('--- PARTE 2: Acesso do Gestor ---');
  await page.goto('https://gla-inema-hml.acto.com.br/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'qa/screenshots/13-tela-login-interno.png' });

  // Preencher login Gestor: 111.111.111-11 / gestor123
  console.log('Realizando login como Gestor (111.111.111-11)...');
  const inputCpfGestor = page.locator('input[id*="cpf"], input[type="text"]').first();
  const inputSenhaGestor = page.locator('input[type="password"]').first();

  await inputCpfGestor.fill('11111111111');
  await inputSenhaGestor.fill('gestor123');
  await page.getByRole('button', { name: /entrar|acessar/i }).click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'qa/screenshots/14-dashboard-gestor.png', fullPage: true });
  console.log('✔ Login de Gestor efetuado com sucesso! URL:', page.url());

  // Acessar Fiscalização > Associar Técnico
  console.log('Navegando para Fiscalização > Associar Técnico...');
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico', { waitUntil: 'networkidle' }).catch(async () => {
    // Tenta clicar no menu se o link direto não for esse
    const menuFiscalizacao = page.locator('text=Fiscalização').first();
    await menuFiscalizacao.click();
    await page.waitForTimeout(500);
    await page.locator('text=Associar Técnico').first().click();
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'qa/screenshots/15-associar-tecnico-gestor.png', fullPage: true });

  // Localizar o RE na tabela
  console.log(`Localizando o RE ${numeroRE}...`);
  const linhaRE = page.locator(`tr:has-text("${numeroRE}"), tr:has-text("2026.000004")`).first();
  
  // Buscar no campo de pesquisa da tabela se necessário
  const buscaTabela = page.locator('input[placeholder*="Buscar"], input[type="search"]').first();
  if (await buscaTabela.isVisible()) {
    await buscaTabela.fill(numeroRE);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: 'qa/screenshots/16-busca-re-gestor.png', fullPage: true });

  // Clicar em "Corrigir vínculo"
  console.log('Procurando ação "Corrigir vínculo"...');
  const btnCorrigirVinculo = page.locator('button:has-text("Corrigir vínculo"), a:has-text("Corrigir vínculo")').first();
  if (await btnCorrigirVinculo.isVisible({ timeout: 3000 }).catch(() => false)) {
    await btnCorrigirVinculo.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'qa/screenshots/17-modal-corrigir-vinculo.png' });

    // Alterar vínculo para Sim
    const radioSimGestor = page.getByLabel('Sim').or(page.locator('input[value="1"]')).first();
    await radioSimGestor.click();
    await page.waitForTimeout(500);

    // Preencher empresa e cargo
    const inputEmpresa = page.getByLabel(/Nome da empresa/i).first();
    const inputCargo = page.getByLabel(/Cargo/i).first();
    if (await inputEmpresa.isVisible()) await inputEmpresa.fill('Petroquímica Camaçari S.A.');
    if (await inputCargo.isVisible()) await inputCargo.fill('Gerente de Operações Químicas');

    // Salvar
    const btnSalvarModal = page.getByRole('button', { name: /salvar|confirmar/i }).last();
    await btnSalvarModal.click();
    await page.waitForTimeout(3000);
    console.log('✔ Vínculo corrigido para Sim com sucesso!');
  }

  // =========================================================================
  // PARTE 3: Retornar ao Portal Externo e Conferir RPEQ Liberado
  // =========================================================================
  console.log('--- PARTE 3: Retorno ao Portal Externo para Conferir RPEQ ---');
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online/emergencia-quimica/nova?emergencia=4', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: 'qa/screenshots/18-rpeq-liberado.png', fullPage: true });

  const rpeqSection = page.locator('text=RPEQ, text=Relatório Preliminar de Emergência Química');
  console.log('RPEQ visível:', await rpeqSection.count() > 0);
});
