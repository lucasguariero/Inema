const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== VERIFICANDO PAUTA DA ÁREA CERTIDÃO DE DÉBITO ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar Pauta da Área
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL Pauta da Área:', page.url());
  const rows = await page.locator('table tbody tr').count();
  console.log('Total de processos na Pauta da Área:', rows);

  if (rows > 0) {
    const row1 = await page.locator('table tbody tr').first().innerText();
    console.log('Processo 1 na Pauta da Área:\n', row1.replace(/\n+/g, ' | '));

    // Ações na Pauta da Área (ex: Retenção ou Distribuição ou Analisar)
    const actions = await page.locator('table tbody tr').first().locator('button, a').all();
    console.log('Total de ações na linha:', actions.length);
    for (let i = 0; i < actions.length; i++) {
      console.log(`   [${i}]: text="${(await actions[i].innerText().catch(() => '')).trim()}" title="${await actions[i].getAttribute('title').catch(() => '')}" wire="${await actions[i].getAttribute('wire:click').catch(() => '')}"`);
    }

    // Se houver botão de reter ou analisar
    const reterBtn = page.locator('table tbody tr').first().locator('button:has-text("Reter"), a:has-text("Reter"), button[wire\\:click*="reter"]');
    if (await reterBtn.count() > 0) {
      console.log('Clicando em Reter...');
      await reterBtn.first().click();
      await page.waitForTimeout(2000);
      console.log('Retenção executada!');
    }
  }

  // Voltar para Pauta Técnico
  console.log('\n--- VERIFICANDO PAUTA TÉCNICO APÓS RETENÇÃO ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const rowsTec = await page.locator('table tbody tr').count();
  console.log('Processos na Pauta Técnico agora:', rowsTec);
  if (rowsTec > 0) {
    const row1Tec = await page.locator('table tbody tr').first().innerText();
    console.log('Processo na Pauta Técnico:\n', row1Tec.replace(/\n+/g, ' | '));

    // Inspecionar ações na Pauta Técnico
    const actionsTec = await page.locator('table tbody tr').first().locator('button, a').all();
    for (let i = 0; i < actionsTec.length; i++) {
      console.log(`   Tec [${i}]: text="${(await actionsTec[i].innerText().catch(() => '')).trim()}" href="${await actionsTec[i].getAttribute('href').catch(() => '')}" wire="${await actionsTec[i].getAttribute('wire:click').catch(() => '')}"`);
    }

    // Clicar no botão de analisar ou link
    const openBtn = page.locator('table tbody tr').first().locator('a, button').first();
    await openBtn.click();
    await page.waitForTimeout(2500);
    console.log('URL após clicar:', page.url());
    console.log('Conteúdo da tela aberta:\n', (await page.innerText('body')).substring(0, 1000).replace(/\n+/g, ' | '));
  }

  await browser.close();
})();
