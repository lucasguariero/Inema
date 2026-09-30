const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('=== INSPEÇÃO DETALHADA DTRP ETAPA 02 ===');

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar edição do rascunho 2
  await page.goto('https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos/2/edit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('URL de edição:', page.url());

  // Verificar botões de navegação no final da página (Próximo)
  const nextBtns = await page.getByRole('button', { name: /Próximo/i }).all();
  console.log('Botões Próximo encontrados:', nextBtns.length);
  if (nextBtns.length > 0) {
    console.log('Clicando em Próximo...');
    await nextBtns[0].click();
    await page.waitForTimeout(3000);
  }

  // Obter texto do formulário
  const formText = await page.locator('form').innerText().catch(() => '');
  console.log('\nTexto do formulário após Próximo (primeiros 2500 chars):\n', formText.substring(0, 2500));

  // Verificar se estamos na Etapa 2
  console.log('\n--- VERIFICAÇÃO ETAPA 02 ---');
  console.log('Etapa 2 ativa:', formText.includes('Etapa 2') || formText.includes('Resíduos') || formText.includes('Tratamento'));
  console.log('Tratamento e Disposição:', formText.includes('Tratamento') || formText.includes('Disposição'));
  console.log('SINIR:', formText.includes('SINIR') || formText.includes('Sinir'));
  console.log('Resíduos:', formText.includes('Resíduo') || formText.includes('NBR 10.004'));
  console.log('Caracterizar:', formText.includes('Caracterizar') || formText.includes('Quantidade'));

  // Verificar inputs, selects e checkboxes na tela
  const inputs = await page.locator('form input, form select, form textarea, form button').all();
  console.log('\nTotal de elementos interativos no form:', inputs.length);
  for (let i = 0; i < Math.min(inputs.length, 25); i++) {
    const tag = await inputs[i].evaluate(el => el.tagName.toLowerCase());
    const type = await inputs[i].getAttribute('type');
    const name = await inputs[i].getAttribute('name');
    const placeholder = await inputs[i].getAttribute('placeholder');
    const txt = (await inputs[i].innerText()).trim();
    console.log(`  [${i}] <${tag}> type="${type}" name="${name}" placeholder="${placeholder}" text="${txt}"`);
  }

  await browser.close();
})();
