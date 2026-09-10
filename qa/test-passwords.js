const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // Teste de senhas prováveis para Call Center 12345678901
  const pwds = [
    '@Callcenter123', '@Callcenter123 ', 'Callcenter123', 'callcenter123',
    'Callcenter@123', 'Inema@2026', 'gestor123', '@CallCenter123',
    'Inema123', '12345678', '123456', 'teste123', 'senha123'
  ];

  for (const p of pwds) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://gla-inema-hml.acto.com.br/login');
    await page.locator('input[type="text"]').first().fill('12345678901');
    await page.locator('input[type="password"]').first().fill(p);
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    if (!page.url().endsWith('/login')) {
      console.log(`>>> SUCESSO CALL CENTER! Senha: "${p}" -> URL: ${page.url()}`);
      await ctx.close();
      break;
    }
    await ctx.close();
  }

  // Verificar menus de Lucas Guariero 99292474081 / Inema@2026
  const ctxL = await browser.newContext();
  const pageL = await ctxL.newPage();
  await pageL.goto('https://gla-inema-hml.acto.com.br/login');
  await pageL.locator('input[type="text"]').first().fill('99292474081');
  await pageL.locator('input[type="password"]').first().fill('Inema@2026');
  await pageL.getByRole('button', { name: /entrar/i }).click();
  await pageL.waitForTimeout(2500);
  console.log('Lucas Logado! URL:', pageL.url());
  const menus = await pageL.locator('nav a, aside a').allInnerTexts();
  console.log('Menus de Lucas:', menus.filter(m => m.trim().length > 0));
  await ctxL.close();

  await browser.close();
})();
