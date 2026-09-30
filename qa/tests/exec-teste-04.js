const { chromium } = require('playwright');
const fs = require('fs');

async function login(page, cpf, pwd) {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill(cpf);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== TESTE 04: CRF - INCAPACIDADE DE PRODUÇÃO ===');
  await login(page, '00000000000', 'admin123');

  // 1. Acessar Reposição Florestal
  console.log('\n1. Acessando Reposição Florestal...');
  await page.goto('https://gla-inema-hml.acto.com.br/reposicao-florestal/reposicao-florestals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const listText = await page.locator('body').innerText();
  console.log('Listagem de Reposição Florestal (primeiros 1500 chars):\n', listText.substring(0, 1500));

  // Procurar botão de Novo Requerimento / Criar
  const createBtn = page.locator('a:has-text("Novo"), a:has-text("Criar"), a:has-text("Cadastrar"), button:has-text("Novo"), button:has-text("Criar")').first();
  if (await createBtn.count() > 0) {
    console.log('Clicando no botão de novo requerimento...');
    await createBtn.click();
    await page.waitForTimeout(3000);
  } else {
    // Tentar URL direta de create
    await page.goto('https://gla-inema-hml.acto.com.br/reposicao-florestal/reposicao-florestals/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
  }

  console.log('URL de Cadastro CRF:', page.url());
  const formText = await page.locator('body').innerText();
  console.log('Texto do Formulário (primeiros 2000 chars):\n', formText.substring(0, 2000));

  await browser.close();
})();
