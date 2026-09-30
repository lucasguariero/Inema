const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('================================================================');
  console.log(' TESTE HOMOLOGAÇÃO: CARDS 12 & 14 (CERTIDÃO DE DÉBITO AMBIENTAL)');
  console.log('================================================================');

  // 1. Login Admin (Técnico / Gestor)
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 2. Inspecionar Pauta Técnico Certidão (Card 12)
  console.log('\n--- 1. PAUTA TÉCNICO CERTIDÃO (CARD 12) ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Pauta Técnico:', page.url());
  const bodyPautaTec = await page.innerText('body');
  const rowsTec = await page.locator('table tbody tr').count();
  console.log('Total de processos na Pauta Técnico:', rowsTec);

  if (rowsTec > 0) {
    const row1 = await page.locator('table tbody tr').first().innerText();
    console.log('Processo 1 na Pauta Técnico:\n', row1.replace(/\n+/g, ' | '));

    // Links/Ações na linha
    const actionsTec = await page.locator('table tbody tr').first().locator('a, button').all();
    for (let i = 0; i < actionsTec.length; i++) {
      const txt = (await actionsTec[i].innerText().catch(() => '')).trim();
      const href = await actionsTec[i].getAttribute('href').catch(() => '');
      console.log(`   Ação [${i}]: text="${txt}" href="${href}"`);
    }

    // Se houver link para analisar, clicar nele
    const analisarBtn = page.locator('table tbody tr').first().locator('a:has-text("Analisar"), button:has-text("Analisar")').first();
    if (await analisarBtn.count() > 0) {
      console.log('Clicando em Analisar...');
      await analisarBtn.click();
      await page.waitForTimeout(2500);

      console.log('URL da tela de Análise:', page.url());
      const bodyAnalise = await page.innerText('body');
      console.log('Abas de análise:', {
        hasAnalise: bodyAnalise.includes('Análise') || bodyAnalise.includes('Analise'),
        hasResumo: bodyAnalise.includes('Resumo'),
        hasAdicionarPendencia: bodyAnalise.includes('Adicionar Pendência') || bodyAnalise.includes('Adicionar Pendencia'),
        hasPendenciasVinculadas: bodyAnalise.includes('Pendências') || bodyAnalise.includes('Pendencias'),
        hasDevolverPauta: bodyAnalise.includes('Devolver') || bodyAnalise.includes('Pauta Geral'),
        hasDownloadProcesso: bodyAnalise.includes('Download') || bodyAnalise.includes('Processo')
      });
    }
  }

  // 3. Inspecionar Minha Pauta Coordenador (Card 14)
  console.log('\n--- 2. MINHA PAUTA COORDENADOR (CARD 14) ---');
  await page.goto('https://gla-inema-hml.acto.com.br/minha-pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Minha Pauta Coordenador:', page.url());
  const bodyCoord = await page.innerText('body');
  const rowsCoord = await page.locator('table tbody tr').count();
  console.log('Total de processos na Minha Pauta Coordenador:', rowsCoord);

  const colunasCoord = await page.locator('table th').allInnerTexts();
  console.log('Colunas Minha Pauta Coordenador:', colunasCoord.map(c => c.trim()).filter(Boolean));

  if (rowsCoord > 0) {
    const row1Coord = await page.locator('table tbody tr').first().innerText();
    console.log('Processo 1 Minha Pauta Coordenador:\n', row1Coord.replace(/\n+/g, ' | '));

    const actionsCoord = await page.locator('table tbody tr').first().locator('a, button').all();
    for (let i = 0; i < actionsCoord.length; i++) {
      const txt = (await actionsCoord[i].innerText().catch(() => '')).trim();
      const href = await actionsCoord[i].getAttribute('href').catch(() => '');
      console.log(`   Ação Coordenador [${i}]: text="${txt}" href="${href}"`);
    }
  }

  await browser.close();
})();
