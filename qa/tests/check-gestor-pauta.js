const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Verificar se há filtros ativos
  const filterBtn = page.locator('button[title*="Filtro"], button:has-text("Filtro"), button.fi-icon-btn[aria-label*="Filtro"]');
  console.log('Botão de Filtro count:', await filterBtn.count());
  
  // Limpar filtros se houver botão
  const clearFilterBtn = page.locator('button:has-text("Limpar filtros")');
  console.log('Limpar filtros visível:', await clearFilterBtn.isVisible().catch(() => false));

  // Verificar texto completo da página
  const body = await page.innerText('main, .fi-main, body');
  console.log('Conteúdo da Pauta da Área:\n', body.substring(0, 1500).replace(/\n+/g, ' | '));

  // Verificar com Gestor (11111111111 / gestor123)
  console.log('\n--- TESTANDO LOGIN COMO GESTOR ---');
  await page.goto('https://gla-inema-hml.acto.com.br/logout');
  await page.waitForTimeout(1500);
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('11111111111');
  await page.locator('input[type="password"]').first().fill('gestor123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Gestor - Linhas na Pauta da Área:', await page.locator('table tbody tr').count());
  const bodyGestor = await page.innerText('main, .fi-main, body');
  console.log('Gestor - Conteúdo Pauta da Área:\n', bodyGestor.substring(0, 1000).replace(/\n+/g, ' | '));

  await page.goto('https://gla-inema-hml.acto.com.br/minha-pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Gestor - Linhas Minha Pauta:', await page.locator('table tbody tr').count());
  const bodyMinhaPauta = await page.innerText('main, .fi-main, body');
  console.log('Gestor - Conteúdo Minha Pauta:\n', bodyMinhaPauta.substring(0, 1000).replace(/\n+/g, ' | '));

  await browser.close();
})();
