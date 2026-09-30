const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  // Capturar chamadas de rede do Livewire
  page.on('response', async res => {
    if (res.url().includes('livewire/update')) {
      try {
        const json = await res.json();
        // Procurar dados de processo ou options
        const jsonStr = JSON.stringify(json);
        if (jsonStr.includes('processo') || jsonStr.includes('Nenhum processo')) {
          console.log('\n--- LIVEWIRE RESPONSE ---');
          console.log(jsonStr.substring(0, 1000));
        }
      } catch (e) {}
    }
  });

  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para tela de identificação
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Verificar em qual step estamos
  console.log('Step 1 URL:', page.url());

  // Na tela de identificacao, precisamos preencher/selecionar os campos obrigatórios para ir para o step 2 (questionario)
  // Vamos ver quais botões ou steps existem
  const stepButtons = await page.locator('button:has-text("Próximo"), [role="tab"]').allInnerTexts();
  console.log('Botões/Tabs no wizard:', stepButtons);

  // Selecionar Requerente se houver radio
  const reqRadio = page.locator('input[value="requerente"], label:has-text("Requerente")');
  if (await reqRadio.count() > 0) {
    await reqRadio.first().click();
    await page.waitForTimeout(1000);
  }

  // Preencher dados obrigatórios do step 1 se houver
  const nextBtn = page.locator('button:has-text("Próximo")');
  if (await nextBtn.count() > 0) {
    console.log('Clicando em Próximo...');
    await nextBtn.first().click();
    await page.waitForTimeout(2500);
    console.log('URL após Próximo:', page.url());
  }

  await browser.close();
})();
