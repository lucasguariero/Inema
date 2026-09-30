const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('99292474081');
  await page.locator('input[type="password"]').first().fill('Inema@2026');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/meus-perfis/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Selecionar Criador Comercial
  console.log('Selecionando Criador Comercial...');
  await page.locator('select#form\\.sp_tipo_perfil').selectOption({ label: 'Criador comercial de passeriformes/Exposições' });
  await page.waitForTimeout(2000);

  // Selecionar Titularidade = Pessoa Jurídica
  console.log('Selecionando Titularidade = Pessoa Jurídica...');
  const titSelect = page.locator('select#form\\.soli_titi_id, select[name*="titi"]');
  if (await titSelect.count() > 0) {
    await titSelect.selectOption({ label: 'Pessoa Jurídica' });
    await page.waitForTimeout(2000);
  }

  const comText = await page.locator('main').innerText();
  console.log('\nTexto após selecionar Pessoa Jurídica:\n', comText);

  // Verificar se os 5 documentos aparecem na tabela
  const docs = await page.locator('table tbody tr').allInnerTexts();
  console.log('Documentos carregados na tabela:', docs.length);
  docs.forEach((d, i) => console.log(`  [${i+1}] ${d.replace(/\n/g, ' | ')}`));

  await browser.close();
})();
