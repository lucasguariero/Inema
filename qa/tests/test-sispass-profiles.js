const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== TESTANDO ASSOCIAÇÃO COM ADMIN ===');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/meus-perfis/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Selecionar Associação
  console.log('1. Selecionando Associação...');
  await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: 1 });
  await page.waitForTimeout(2000);

  const associacaoText = await page.locator('main').innerText();
  console.log('Texto após selecionar Associação (primeiros 2000 chars):\n', associacaoText.substring(0, 2000));

  // Verificar campos: Titularidade ausente, CNPJ presente, Responsável Técnico, CTF
  console.log('Titularidade ausente:', !associacaoText.includes('Titularidade'));
  console.log('CNPJ presente:', associacaoText.includes('CNPJ'));
  console.log('Responsável Técnico presente:', associacaoText.includes('Responsável Técnico'));
  console.log('CTF presente:', associacaoText.includes('CTF'));

  // Verificar abas Etapa 1 / Etapa 2
  const et1 = associacaoText.includes('Etapa 1');
  const et2 = associacaoText.includes('Etapa 2');
  console.log('Etapa 1 visível:', et1);
  console.log('Etapa 2 visível:', et2);

  // Verificar comprovante de residência: "Comprovante de residência, expedido nos últimos 60 (sessenta) dias"
  console.log('Comprovante de residência (60 dias) presente:', associacaoText.includes('últimos 60 (sessenta) dias'));

  // Agora testar com outro usuário (ex: Lucas Guariero ou Gestor) para ver Criador Amador e Comercial
  console.log('\n=== TESTANDO COM OUTRO USUÁRIO (LUCAS GUARIERO) ===');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('99292474081');
  await page.locator('input[type="password"]').first().fill('Inema@2026');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/meus-perfis/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const selectOptions = await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').locator('option').allInnerTexts();
  console.log('Opções de perfil para Lucas Guariero:', selectOptions);

  // Selecionar Criador Amador se disponível
  const idxAmador = selectOptions.findIndex(o => o.toLowerCase().includes('amador'));
  if (idxAmador >= 0) {
    console.log(`\n2. Selecionando Criador Amador (índice ${idxAmador})...`);
    await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: idxAmador });
    await page.waitForTimeout(2000);

    const amadorText = await page.locator('main').innerText();
    console.log('Texto do Criador Amador:\n', amadorText.substring(0, 1500));
    console.log('Responsável Técnico ausente:', !amadorText.includes('Responsável Técnico'));
    console.log('Longitude da Entrada do Criadouro presente:', amadorText.includes('Longitude da Entrada do Criadouro'));
    console.log('Latitude da Entrada presente:', amadorText.includes('Latitude'));
  }

  // Selecionar Criador Comercial se disponível
  const idxComercial = selectOptions.findIndex(o => o.toLowerCase().includes('comercial'));
  if (idxComercial >= 0) {
    console.log(`\n3. Selecionando Criador Comercial (índice ${idxComercial})...`);
    await page.locator('select#form\\.sp_tipo_perfil, select[name*="sp_tipo_perfil"]').selectOption({ index: idxComercial });
    await page.waitForTimeout(2000);

    const comText = await page.locator('main').innerText();
    console.log('Texto do Criador Comercial:\n', comText.substring(0, 1500));
    console.log('Documento do representante legal (60 dias):', comText.includes('do representante legal'));
  }

  await browser.close();
})();
