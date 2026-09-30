const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para tela de usuários
  await page.goto('https://gla-inema-hml.acto.com.br/users', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Buscar "Técnico ATEND" ou "Jully"
  const rowTecnico = page.locator('table tbody tr').filter({ hasText: '735.128.460-17' }).first();
  console.log('Achou Técnico ATEND:', await rowTecnico.count());

  // Alterar senha do Técnico ATEND para admin123
  if (await rowTecnico.count() > 0) {
    const btnSenha = rowTecnico.locator('button:has-text("Alterar senha")');
    console.log('Botao alterar senha count:', await btnSenha.count());
    await btnSenha.click();
    await page.waitForTimeout(1500);

    const inputSenha = page.locator('.fi-modal input[type="password"]').first();
    const inputConfirm = page.locator('.fi-modal input[type="password"]').nth(1);
    if (await inputSenha.count() > 0) {
      await inputSenha.fill('admin123');
      if (await inputConfirm.count() > 0) {
        await inputConfirm.fill('admin123');
      }
      const submitBtn = page.locator('.fi-modal button[type="submit"]');
      await submitBtn.click();
      await page.waitForTimeout(2000);
      console.log('Senha alterada com sucesso!');
    }
  }

  // Agora deslogar e logar com Técnico ATEND
  await page.goto('https://gla-inema-hml.acto.com.br/logout');
  await page.waitForTimeout(1500);
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('73512846017');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  console.log('Login Tecnico ATEND URL:', page.url());
  if (!page.url().includes('login')) {
    await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const rows = await page.locator('table tbody tr').count();
    console.log('Tecnico ATEND - Linhas na Pauta da Área:', rows);
    if (rows > 0) {
      console.log('Linha 1:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));
    }

    await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    const rowsTec = await page.locator('table tbody tr').count();
    console.log('Tecnico ATEND - Linhas na Pauta Técnico:', rowsTec);
    if (rowsTec > 0) {
      console.log('Linha 1 Tec:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));
    }
  }

  await browser.close();
})();
