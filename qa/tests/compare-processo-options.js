const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  let lastUpdatePayload = null;
  page.on('request', req => {
    if (req.url().includes('livewire/update')) {
      try {
        lastUpdatePayload = JSON.parse(req.postData());
      } catch (e) {}
    }
  });

  page.on('response', async res => {
    if (res.url().includes('livewire/update')) {
      try {
        const json = await res.json();
        console.log('\n=== LIVEWIRE SERVER RESPONSE ===');
        const effects = json.components[0].effects || {};
        console.log('Dispatches/Events:', effects.dispatches);
        
        // Procurar no html ou snapshot se tem mensagens de validação ou options
        const str = JSON.stringify(json);
        const match = str.match(/processo[^"]*/g);
        if (match) console.log('Matches de processo:', match.slice(0, 10));
      } catch (e) {}
    }
  });

  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Acessar tela de identificação
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Passo 1 -> Próximo
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);

  // Passo 2: Selecionar "Dar continuidade..." no Tipo de Solicitação
  console.log('Selecionando Dar continuidade no Tipo de Solicitação...');
  const darContinuidadeRadio = page.locator('label:has-text("Dar continuidade ou alterar os dados do ato ambiental já existente")');
  await darContinuidadeRadio.click();
  await page.waitForTimeout(1500);

  // Passo 2 -> Próximo (vai para Questionário)
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(2000);
  console.log('Chegou no Questionário! URL:', page.url());

  // Inspecionar perguntas presentes na tela
  const radiosQuestionario = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('label')).map(l => l.innerText.trim()).filter(Boolean);
  });
  console.log('Radios no Questionário:\n', radiosQuestionario.filter(r => r.includes('1.1') || r.includes('ato') || r.includes('fase') || r.includes('Renovar') || r.includes('Alterar')));

  // Clicar em "Alterar dados do ato"
  const radioAlterar = page.locator('label:has-text("Alterar dados do ato")');
  console.log('Achou radio Alterar dados do ato:', await radioAlterar.count());
  if (await radioAlterar.count() > 0) {
    await radioAlterar.click();
    await page.waitForTimeout(2500);

    // Inspecionar a mensagem ou opções do select
    const msg = await page.locator('.fi-fo-field-wrp, [wire\\:model*="processo"], .fi-select').allInnerTexts();
    console.log('Textos dos campos após clicar em Alterar dados do ato:\n', msg.join('\n---\n'));
  }

  // Clicar em "Avançar para a próxima fase" para comparar!
  const radioAvancar = page.locator('label:has-text("Avançar para a próxima fase")');
  if (await radioAvancar.count() > 0) {
    console.log('\n>>> Clicando em Avançar para a próxima fase...');
    await radioAvancar.click();
    await page.waitForTimeout(2500);
    const msgAvancar = await page.locator('.fi-fo-field-wrp, [wire\\:model*="processo"], .fi-select').allInnerTexts();
    console.log('Textos dos campos após Avançar para a próxima fase:\n', msgAvancar.join('\n---\n'));
  }

  // Clicar em "Renovar" para comparar!
  const radioRenovar = page.locator('label:has-text("Renovar")');
  if (await radioRenovar.count() > 0) {
    console.log('\n>>> Clicando em Renovar...');
    await radioRenovar.click();
    await page.waitForTimeout(2500);
    const msgRenovar = await page.locator('.fi-fo-field-wrp, [wire\\:model*="processo"], .fi-select').allInnerTexts();
    console.log('Textos dos campos após Renovar:\n', msgRenovar.join('\n---\n'));
  }

  await browser.close();
})();
