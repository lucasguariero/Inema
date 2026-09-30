const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== VERIFICANDO ROTAS E TELAS DO LOTE (CARDS 10 A 14) ===');

  // 1. Login Admin
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Mapear links da sidebar e menus
  const links = await page.locator('nav a, aside a, .sidebar a, ul a').evaluateAll(els => els.map(e => ({ text: e.innerText.trim(), href: e.href })));
  console.log('Links encontrados no menu Admin:', links.filter(l => l.text.length > 0));

  // Verificar Card 10: Pauta Técnica Enquadramento
  console.log('\n--- VERIFICANDO CARD 10: Pauta Técnica Enquadramento ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-enquadramento', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL Card 10:', page.url());
  const bodyCard10 = await page.innerText('body');
  console.log('Card 10 Abas/Textos:', {
    hasTodos: bodyCard10.includes('Todos'),
    hasAguardando: bodyCard10.includes('Aguardando'),
    hasEmAnalise: bodyCard10.includes('Em Análise') || bodyCard10.includes('Em analise'),
    hasValidacaoPrevia: bodyCard10.includes('Validação Prévia') || bodyCard10.includes('Validacao Previa'),
    hasPendencias: bodyCard10.includes('Pendências') || bodyCard10.includes('Pendencias'),
  });

  // Verificar Card 11 e 13: Parcelamento (Inicial e Meus Processos)
  console.log('\n--- VERIFICANDO CARDS 11 & 13: Parcelamento & Meus Processos ---');
  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('URL Meus Processos:', page.url());
  const bodyMeusProcessos = await page.innerText('body');
  console.log('Meus Processos Abas:', {
    hasTodos: bodyMeusProcessos.includes('Todos'),
    hasRascunho: bodyMeusProcessos.includes('Rascunho'),
    hasAguardandoPagamento: bodyMeusProcessos.includes('Aguardando Pagamento'),
    hasEmAnalise: bodyMeusProcessos.includes('Em Análise'),
    hasPendentes: bodyMeusProcessos.includes('Pendentes'),
    hasConcluido: bodyMeusProcessos.includes('Concluído') || bodyMeusProcessos.includes('Concluido'),
  });

  // Testar rotas de parcelamento possíveis
  const parcelamentoRoutes = [
    '/parcelamento',
    '/requerimento/parcelamento',
    '/solicitar-parcelamento',
    '/parcelamentos',
    '/dae/parcelamento'
  ];
  for (const r of parcelamentoRoutes) {
    await page.goto(`https://gla-inema-hml.acto.com.br${r}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log(`Rota ${r} -> status/url: ${page.url()}`);
  }

  // Verificar Certidão de Débito (Cards 12 e 14)
  console.log('\n--- VERIFICANDO CARDS 12 & 14: Certidão de Débito ---');
  const certidaoRoutes = [
    '/processos-finalizados-certidao-debito',
    '/pauta-tecnica-certidao',
    '/pauta-coordenador-certidao',
    '/certidao-debito-analise',
    '/analisar-certidao-debito'
  ];
  for (const r of certidaoRoutes) {
    await page.goto(`https://gla-inema-hml.acto.com.br${r}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log(`Rota ${r} -> status/url: ${page.url()}`);
  }

  // Login Gestor para conferir Card 14
  console.log('\n--- VERIFICANDO ACESSO GESTOR ---');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  const linksGestor = await page.locator('nav a, aside a, .sidebar a, ul a').evaluateAll(els => els.map(e => ({ text: e.innerText.trim(), href: e.href })));
  console.log('Links Gestor:', linksGestor.filter(l => l.text.length > 0));

  await browser.close();
})();
