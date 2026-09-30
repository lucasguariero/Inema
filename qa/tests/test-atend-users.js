const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const users = [
    { name: 'Técnico ATEND', cpf: '73512846017', pwd: 'admin123' },
    { name: 'Coordenador ATEND', cpf: '64629735100', pwd: 'admin123' },
    { name: 'Técnico ATEND (pwd gestor123)', cpf: '73512846017', pwd: 'gestor123' },
    { name: 'Coordenador ATEND (pwd gestor123)', cpf: '64629735100', pwd: 'gestor123' },
    { name: 'Técnico ATEND (pwd teste123)', cpf: '73512846017', pwd: 'teste123' },
    { name: 'Coordenador ATEND (pwd teste123)', cpf: '64629735100', pwd: 'teste123' },
  ];

  for (const u of users) {
    await page.goto('https://gla-inema-hml.acto.com.br/login');
    await page.locator('input[type="text"]').first().fill(u.cpf);
    await page.locator('input[type="password"]').first().fill(u.pwd);
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);

    if (!page.url().includes('login')) {
      console.log(`\n=== SUCESSO LOGIN: ${u.name} (CPF: ${u.cpf}, PWD: ${u.pwd}) ===`);
      await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const rowsArea = await page.locator('table tbody tr').count();
      console.log('Linhas Pauta da Área:', rowsArea);
      if (rowsArea > 0) {
        console.log('Texto linha 1 Pauta da Área:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));
      }

      await page.goto('https://gla-inema-hml.acto.com.br/pauta-tecnica-certidao-debito', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
      const rowsTec = await page.locator('table tbody tr').count();
      console.log('Linhas Pauta Técnico:', rowsTec);
      if (rowsTec > 0) {
        console.log('Texto linha 1 Pauta Técnico:\n', (await page.locator('table tbody tr').first().innerText()).replace(/\n+/g, ' | '));
      }

      await page.goto('https://gla-inema-hml.acto.com.br/logout');
      await page.waitForTimeout(1000);
    }
  }

  await browser.close();
})();
