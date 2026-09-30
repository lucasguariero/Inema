const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  
  // Vamos logar com Caick (o usuário CE do print dele) ou Admin
  // No print, o avatar é 'CE', vamos ver se Caick Externo tem login
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Marcar 'Dar continuidade ou alterar os dados do ato ambiental já existente'
  const radioDarContinuidade = page.locator('label:has-text("Dar continuidade ou alterar os dados do ato ambiental já existente")');
  console.log('Existe radio Dar Continuidade:', await radioDarContinuidade.count());
  await radioDarContinuidade.click();
  await page.waitForTimeout(1500);

  // Ver todas as opções que aparecem no bloco 1.1
  const subOptions = [
    'Avançar para a próxima fase',
    'Renovar',
    'Prorrogar Prazo',
    'Alterar dados do ato',
    'Ampliar ou Modificar'
  ];

  for (const opt of subOptions) {
    const r = page.locator(`label:has-text("${opt}")`);
    if (await r.count() > 0) {
      await r.click();
      await page.waitForTimeout(1500);
      
      // Inspecionar o select de processo
      const selectHtml = await page.locator('select, .fi-select-input, [wire\\:model*="processo"]').first().innerHTML().catch(() => '');
      const selectText = await page.locator('.fi-select, select, [wire\\:model*="processo"]').first().innerText().catch(() => '');
      const alertNotFound = await page.locator('.fi-fo-placeholder, text="Nenhum processo encontrado"').allInnerTexts().catch(() => []);
      
      console.log(`\nOpção: "${opt}"`);
      console.log('   Alerta:', alertNotFound);
      console.log('   Texto do select/campo:', selectText.replace(/\n+/g, ' | ').substring(0, 200));
      
      // Obter options do select se houver <select>
      const options = await page.evaluate(() => {
        const sel = document.querySelector('select[wire\\:model*="processo"], select');
        if (!sel) return [];
        return Array.from(sel.options).map(o => ({ value: o.value, text: o.text }));
      });
      console.log('   Opções no select:', options.length > 0 ? options : 'Nenhum <select> nativo ou opções');
    }
  }

  await browser.close();
})();
