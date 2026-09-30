const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('=== TESTANDO COM USUÁRIO LUCAS GUARIERO ===');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('99292474081');
  await page.locator('input[type="password"]').first().fill('Inema@2026');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/meus-perfis/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const selectOptions = await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').locator('option').allInnerTexts();
  console.log('Opções de perfil disponíveis para Lucas Guariero:\n', selectOptions.map(s => s.trim()).filter(Boolean));

  // 1. Testar Criador Amador
  const idxAmador = selectOptions.findIndex(o => o.toLowerCase().includes('amador'));
  if (idxAmador >= 0) {
    console.log(`\n1. Selecionando Criador Amador (índice ${idxAmador})...`);
    await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: idxAmador });
    await page.waitForTimeout(2000);

    const amadorText = await page.locator('main').innerText();
    console.log('--- Texto Criador Amador (primeiros 1500 chars) ---:\n', amadorText.substring(0, 1500));
    console.log('Responsável Técnico ausente:', !amadorText.includes('Responsável Técnico'));
    console.log('Longitude da Entrada do Criadouro presente:', amadorText.includes('Longitude da Entrada do Criadouro'));
    console.log('Latitude da Entrada presente:', amadorText.includes('Latitude'));
    console.log('Comprovante de residência (60 dias) presente:', amadorText.includes('últimos 60 (sessenta) dias'));
  }

  // 2. Testar Criador Comercial
  const idxComercial = selectOptions.findIndex(o => o.toLowerCase().includes('comercial'));
  if (idxComercial >= 0) {
    console.log(`\n2. Selecionando Criador Comercial (índice ${idxComercial})...`);
    await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: idxComercial });
    await page.waitForTimeout(2000);

    const comText = await page.locator('main').innerText();
    console.log('--- Texto Criador Comercial (primeiros 1500 chars) ---:\n', comText.substring(0, 1500));
    console.log('Responsável Técnico presente no Criador Comercial:', comText.includes('Responsável Técnico'));
    console.log('Titularidade presente:', comText.includes('Titularidade'));
    console.log('Documentos do Criador Comercial contêm "do representante legal":', comText.includes('do representante legal'));
    
    // Contar documentos na tabela
    const rows = await page.locator('table tbody tr').all();
    console.log('Quantidade de documentos na tabela do Comercial:', rows.length);
    for (const r of rows) {
      console.log('  Doc:', (await r.innerText()).trim().replace(/\n/g, ' | '));
    }
  }

  // 3. Testar Responsável Técnico
  const idxRT = selectOptions.findIndex(o => o.toLowerCase().includes('responsável técnico') || o.toLowerCase().includes('responsavel'));
  if (idxRT >= 0) {
    console.log(`\n3. Selecionando Responsável Técnico (índice ${idxRT})...`);
    await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: idxRT });
    await page.waitForTimeout(2000);

    const rtText = await page.locator('main').innerText();
    console.log('--- Texto Responsável Técnico ---:\n', rtText.substring(0, 1000));
    console.log('CRMV presente:', rtText.includes('CRMV'));
    console.log('Carteirinha CRMV presente:', rtText.includes('Carteirinha do Conselho'));
    console.log('Certidão Negativa presente:', rtText.includes('Certidão Negativa'));
  }

  await browser.close();
})();
