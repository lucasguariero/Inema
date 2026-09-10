const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Teste CPFs alternativos para Call Center
  const ccCpfs = ['12345678909', '12345678900', '12345678910', '12345678901'];
  for (const cpf of ccCpfs) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://gla-inema-hml.acto.com.br/login');
    await page.locator('input[type="text"]').first().fill(cpf);
    await page.locator('input[type="password"]').first().fill('@Callcenter123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2500);
    console.log(`CPF ${cpf} + @Callcenter123 -> URL: ${page.url()}`);
    await ctx.close();
  }

  // Teste Gestor na tela de Associar Técnico
  const ctxGestor = await browser.newContext();
  const pageGestor = await ctxGestor.newPage();
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/login');
  await pageGestor.locator('input[type="text"]').first().fill('11111111111');
  await pageGestor.locator('input[type="password"]').first().fill('gestor123');
  await pageGestor.getByRole('button', { name: /entrar/i }).click();
  await pageGestor.waitForTimeout(2500);
  await pageGestor.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/associar-tecnico');
  await pageGestor.waitForTimeout(2500);
  
  console.log('Gestor: Associar Técnico URL:', pageGestor.url());
  const btnAssociar = pageGestor.locator('button:has-text("Associar técnico"), a:has-text("Associar técnico")');
  console.log('Gestor: Botões Associar Técnico encontrados:', await btnAssociar.count());
  if (await btnAssociar.count() > 0) {
    await btnAssociar.first().click();
    await pageGestor.waitForTimeout(1500);
    await pageGestor.screenshot({ path: 'qa/screenshots/debug-gestor-modal-associar.png' });
    console.log('Modal de Associar Técnico aberto pelo Gestor!');
  }
  await ctxGestor.close();

  await browser.close();
})();
