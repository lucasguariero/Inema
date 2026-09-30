const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  page.on('response', async res => {
    if (res.url().includes('livewire/update')) {
      try {
        const json = await res.json();
        const jsonStr = JSON.stringify(json);
        if (jsonStr.includes('processo') || jsonStr.includes('opcoes') || jsonStr.includes('Nenhum')) {
          console.log('\n>>> LIVEWIRE UPDATE:');
          console.log(jsonStr.substring(0, 800));
        }
      } catch (e) {}
    }
  });

  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para identificacao e passar step 1 e 2
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);
  await page.locator('label:has-text("Regularização Ambiental do Empreendimento")').click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(2000);

  console.log('Chegou no Questionário! URL:', page.url());

  // Na tela do Questionário, achar o radio "Dar continuidade..."
  const radioDarContinuidade = page.locator('input[type="radio"], label').filter({ hasText: 'Dar continuidade ou alterar os dados' }).first();
  console.log('Clicando em Dar continuidade...');
  await radioDarContinuidade.click();
  await page.waitForTimeout(2000);

  // Ver perguntas que apareceram
  const questions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.fi-fo-field-wrp, .fi-fo-radio, label')).map(el => el.innerText.trim()).filter(t => t.includes('1.1') || t.includes('ato'));
  });
  console.log('Perguntas que apareceram:\n', questions.slice(0, 10));

  // Clicar em "Alterar dados do ato"
  const radioAlterar = page.locator('label:has-text("Alterar dados do ato")').first();
  console.log('Clicando em Alterar dados do ato...');
  await radioAlterar.click();
  await page.waitForTimeout(2500);

  // Inspecionar o campo 1.1.1
  const campo111 = await page.evaluate(() => {
    const el = document.querySelector('[wire\\:model*="processo"], select, .fi-fo-select');
    return {
      text: el ? el.innerText.trim().replace(/\n+/g, ' | ') : 'Não achou',
      html: el ? el.outerHTML.substring(0, 300) : ''
    };
  });
  console.log('Campo 1.1.1 Selecionar Processo:\n', campo111);

  // Testar também as outras opções pra ver o que aparece nelas!
  const outrasOpcoes = [
    'Avançar para a próxima fase do licenciamento',
    'Renovar (o prazo do ato vai vencer / venceu)',
    'Prorrogar Prazo de Validade da Portaria',
    'Ampliar ou Modificar ato/processo ambiental'
  ];

  for (const opt of outrasOpcoes) {
    console.log(`\n--- Testando opção: "${opt}" ---`);
    const r = page.locator(`label:has-text("${opt}")`).first();
    if (await r.count() > 0) {
      await r.click();
      await page.waitForTimeout(2000);
      const res = await page.evaluate(() => {
        const el = document.querySelector('[wire\\:model*="processo"], select, .fi-fo-select');
        return el ? el.innerText.trim().replace(/\n+/g, ' | ') : 'Não achou';
      });
      console.log('Resultado no campo de processo:', res.substring(0, 200));
    }
  }

  await browser.close();
})();
