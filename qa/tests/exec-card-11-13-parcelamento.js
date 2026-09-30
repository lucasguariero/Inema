const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== TESTE CARD 11 & 13: PARCELAMENTO COMPLETO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Tela Inicial Parcelamento (TL002)
  console.log('\n--- 1. TELA INICIAL PARCELAMENTO ---');
  await page.goto('https://gla-inema-hml.acto.com.br/parcelamento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const solicitarBtn = page.locator('button:has-text("Solicitar Parcelamento"), a:has-text("Solicitar Parcelamento")');
  if (await solicitarBtn.count() > 0) {
    const isDis = await solicitarBtn.first().isDisabled().catch(() => false);
    const btnHtml = await solicitarBtn.first().evaluate(el => el.outerHTML);
    console.log('Botão Solicitar Parcelamento:', { isDis, text: (await solicitarBtn.first().innerText()).trim() });
    console.log('HTML do botão:', btnHtml);
  }

  // 2. Tela Meus Processos (TL001)
  console.log('\n--- 2. MEUS PROCESSOS ---');
  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const bodyMeusProc = await page.innerText('body');
  const abas = ['Todos', 'Rascunho', 'Aguardando Pagamento', 'Em Análise', 'Pendentes', 'Concluído'];
  for (const a of abas) {
    console.log(` - Aba "${a}":`, bodyMeusProc.includes(a));
  }

  const colunas = await page.locator('table th').allInnerTexts();
  console.log('Colunas Meus Processos:', colunas.map(c => c.trim()).filter(Boolean));

  const totalRows = await page.locator('table tbody tr').count();
  console.log('Total de linhas em Meus Processos:', totalRows);
  if (totalRows > 0) {
    const r1 = await page.locator('table tbody tr').first().innerText();
    console.log('Linha 1 Meus Processos:\n', r1.replace(/\n+/g, ' | '));

    // Verificar ação visualizar
    const viewBtn = page.locator('table tbody tr').first().locator('button[title*="visualizar" i], a[title*="visualizar" i], button:has-text("Visualizar"), a:has-text("Visualizar")');
    console.log('Botão Visualizar presente:', await viewBtn.count() > 0);
  }

  // 3. Card 13: Rotas do Wizard de Parcelamento
  console.log('\n--- 3. VERIFICANDO WIZARD PARCELAMENTO (CARD 13) ---');
  // Buscar no código ou nos links de parcelamento
  const routesToTest = [
    '/parcelamento/solicitar',
    '/solicitar-parcelamento',
    '/requerimento/parcelamento',
    '/parcelamento/wizard',
    '/parcelamento/novo'
  ];
  for (const r of routesToTest) {
    await page.goto(`https://gla-inema-hml.acto.com.br${r}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const txt = await page.innerText('body');
    const is404 = txt.includes('404') || txt.includes('Not Found');
    const isLogin = page.url().includes('login');
    console.log(`Rota ${r} -> URL: ${page.url()} | 404: ${is404} | Tem Quem sou eu: ${txt.includes('Quem sou eu')} | Tem Partícipe: ${txt.includes('Partícipe') || txt.includes('Participe')}`);
  }

  await browser.close();
})();
