const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE DETALHADO CARD 13: WIZARD PARCELAMENTO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/parcelamento/solicitar', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('1. URL Atual:', page.url());
  const bodyText = await page.innerText('body');
  console.log('2. Título / Cabeçalho:', bodyText.substring(0, 500).replace(/\n+/g, ' | '));

  // Etapas do Wizard
  console.log('\n--- ETAPAS DO WIZARD ---');
  console.log('Possui Etapa Partícipes/Participantes:', bodyText.includes('Partícipe') || bodyText.includes('Participante') || bodyText.includes('Partícipes'));
  console.log('Possui Etapa Processo:', bodyText.includes('Processo'));
  console.log('Possui Etapa Resumo:', bodyText.includes('Resumo'));

  // Campos da Etapa 01: Quem sou eu?
  console.log('\n--- CAMPOS ETAPA 01 (PARTÍCIPES) ---');
  console.log('Quem sou eu?:', bodyText.includes('Quem sou eu'));
  console.log('Requerente:', bodyText.includes('Requerente'));
  console.log('Representante Legal:', bodyText.includes('Representante Legal'));
  console.log('Procurador:', bodyText.includes('Procurador'));

  // Inspecionar inputs e rádios
  const radios = await page.locator('input[type="radio"]').all();
  console.log('Total de opções de rádio (Quem sou eu):', radios.length);

  // Inspecionar botões de navegação
  const buttons = await page.locator('button, a.btn, a.fi-btn').allInnerTexts();
  console.log('Botões na tela:\n', buttons.map(b => b.trim()).filter(Boolean));

  // Inspecionar tabela de partícipes
  const tables = await page.locator('table').count();
  console.log('Tabelas na Etapa 01:', tables);
  if (tables > 0) {
    const ths = await page.locator('table th').allInnerTexts();
    console.log('Colunas tabela partícipes:', ths.map(t => t.trim()).filter(Boolean));
  }

  await browser.close();
})();
