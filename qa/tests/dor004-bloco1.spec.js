const { test, expect } = require('@playwright/test');

test('Bloco 1 e 2 - Acesso e Abertura de Emergência Química Externa', async ({ page }) => {
  // 1. Acessar portal /servicos-online
  console.log('1. Acessando portal https://gla-inema-hml.acto.com.br/servicos-online ...');
  await page.goto('https://gla-inema-hml.acto.com.br/servicos-online', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'qa/screenshots/01-portal.png', fullPage: true });

  // 2. Clicar em "Registrar Emergência Química"
  console.log('2. Clicando em "Registrar Emergência Química"...');
  const btnEmergencia = page.locator('text=Registrar Emergência Química');
  await expect(btnEmergencia).toBeVisible();
  await btnEmergencia.click();

  // 3. Validar modal explicativo sem redirecionamento imediato
  console.log('3. Validando modal explicativo...');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'qa/screenshots/02-modal-explicativo.png' });

  // 4. Clicar em "Simular autenticação"
  console.log('4. Clicando em "Simular autenticação"...');
  const btnSimular = page.getByRole('button', { name: 'Simular autenticação' });
  await expect(btnSimular).toBeVisible();
  await btnSimular.click();

  // 5. Tela com CPF preenchido -> Clicar em Entrar
  console.log('5. Validando tela de autenticação com CPF...');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'qa/screenshots/03-autenticacao-cpf.png' });

  const btnEntrar = page.getByRole('button', { name: /entrar/i });
  if (await btnEntrar.isVisible()) {
    console.log('Clicando em Entrar...');
    await btnEntrar.click();
  }

  // 6. Validar Abertura do Formulário
  console.log('6. Validando abertura do formulário...');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'qa/screenshots/04-formulario-aberto.png', fullPage: true });

  console.log('URL final:', page.url());
});
