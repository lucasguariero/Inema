const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  const testCases = [
    { name: 'Call Center sem mascara', cpf: '12345678901', pass: '@Callcenter123' },
    { name: 'Call Center com mascara', cpf: '123.456.789-01', pass: '@Callcenter123' },
    { name: 'Call Center minusculo', cpf: '12345678901', pass: '@callcenter123' },
    { name: 'Call Center sem arroba', cpf: '12345678901', pass: 'Callcenter123' },
    { name: 'Lucas Guariero (Admin/Tester)', cpf: '99292474081', pass: 'Inema@2026' },
    { name: 'Gestor', cpf: '11111111111', pass: 'gestor123' },
  ];

  for (const tc of testCases) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
    
    await page.locator('input[id*="cpf"], input[type="text"]').first().fill(tc.cpf);
    await page.locator('input[type="password"]').first().fill(tc.pass);
    await page.getByRole('button', { name: /entrar|acessar/i }).click();
    await page.waitForTimeout(3000);
    
    const url = page.url();
    const erro = await page.locator('text=Credenciais incorretas').count() > 0;
    console.log(`[${tc.name}] URL: ${url} | Erro: ${erro}`);
    await ctx.close();
  }
  
  await browser.close();
})();
