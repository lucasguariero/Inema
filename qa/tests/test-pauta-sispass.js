const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Navegar para a Pauta Geral de Perfis do SISPASS
  console.log('Acessando Pauta de Validação de Perfis SISPASS...');
  await page.goto('https://gla-inema-hml.acto.com.br/validar-documentos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const pautaText = await page.locator('main').innerText();
  console.log('Texto da Pauta Geral (primeiros 1000 chars):\n', pautaText.substring(0, 1000));

  // Abrir uma das linhas para visualizar a validação
  const viewBtn = page.locator('table tbody tr a, table tbody tr button').first();
  if (await viewBtn.count() > 0) {
    await viewBtn.click();
    await page.waitForTimeout(2500);
    const detailText = await page.locator('main').innerText();
    console.log('\nTexto de Detalhes da Validação do Perfil:\n', detailText.substring(0, 1500));
    console.log('Seção Cadastro Básico presente:', detailText.includes('Cadastro Básico') || detailText.includes('Documento de Identificação'));
  }

  await browser.close();
})();
