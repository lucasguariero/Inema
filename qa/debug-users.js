const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Inspecionar Call Center tela após submit
  const ctxCC = await browser.newContext();
  const pageCC = await ctxCC.newPage();
  await pageCC.goto('https://gla-inema-hml.acto.com.br/login');
  await pageCC.locator('input[id*="cpf"]').first().fill('12345678901');
  await pageCC.locator('input[type="password"]').first().fill('@Callcenter123');
  await pageCC.getByRole('button', { name: /entrar/i }).click();
  await pageCC.waitForTimeout(3000);
  await pageCC.screenshot({ path: 'qa/screenshots/debug-cc-login.png' });
  console.log('CC URL:', pageCC.url());
  const bodyText = await pageCC.locator('body').innerText();
  console.log('CC Body excerpt:', bodyText.substring(0, 300).replace(/\n/g, ' '));
  await ctxCC.close();

  // 2. Inspecionar Gestor tela Associar Tecnico
  const ctxGestor = await browser.newContext();
  const pageGestor = await ctxGestor.newPage();
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/login');
  await pageGestor.locator('input[id*="cpf"]').first().fill('11111111111');
  await pageGestor.locator('input[type="password"]').first().fill('gestor123');
  await pageGestor.getByRole('button', { name: /entrar/i }).click();
  await pageGestor.waitForTimeout(2500);
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico');
  await pageGestor.waitForTimeout(2500);
  console.log('Gestor na tela Associar Técnico. Titulo:', await pageGestor.title());
  
  // Localizar RE 2026.000004/INEMA/RE
  const linhaRE = pageGestor.locator('tr:has-text("2026.000004")');
  console.log('Linhas com RE 2026.000004 encontradas:', await linhaRE.count());
  if (await linhaRE.count() > 0) {
    console.log('Conteudo da linha:', await linhaRE.first().innerText());
  }

  // 3. Inspecionar Lucas Guariero
  const ctxLucas = await browser.newContext();
  const pageLucas = await ctxLucas.newPage();
  await pageLucas.goto('https://gla-inema-hml.acto.com.br/login');
  await pageLucas.locator('input[id*="cpf"]').first().fill('99292474081');
  await pageLucas.locator('input[type="password"]').first().fill('Inema@2026');
  await pageLucas.getByRole('button', { name: /entrar/i }).click();
  await pageLucas.waitForTimeout(2500);
  console.log('Lucas URL:', pageLucas.url());
  await pageLucas.screenshot({ path: 'qa/screenshots/debug-lucas-dashboard.png' });
  await ctxLucas.close();

  await browser.close();
})();
