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

  console.log('=== TESTE 04: EXECUTANDO FLUXO CRF ===');
  await login(page, '00000000000', 'admin123');

  await page.goto('https://gla-inema-hml.acto.com.br/reposicao-florestal/reposicao-florestals/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Passo 1: Quem sou eu -> Requerente
  console.log('Passo 1: Selecionando Quem sou eu -> Requerente...');
  await page.getByText('Requerente', { exact: true }).click();
  await page.waitForTimeout(1500);

  // Selecionar Empreendimento DTRP Demonstração
  console.log('Selecionando Empreendimento DTRP Demonstração...');
  const emprBtn = page.locator('button[id*="empr"], button[id*="empreendimento"]').first();
  if (await emprBtn.count() > 0) {
    await emprBtn.click();
    await page.waitForTimeout(800);
    const opt = page.locator('[role="option"]:has-text("DTRP Demonstração")').first();
    if (await opt.count() > 0) {
      await opt.click();
    } else {
      await page.locator('[role="option"]:visible').first().click();
    }
    await page.waitForTimeout(1000);
  }

  // Clicar Próximo
  console.log('Avançando para Passo 2 (Questionários)...');
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);

  const step2Text = await page.locator('main').innerText();
  console.log('\nTexto Passo 2 (primeiros 2000 chars):\n', step2Text.substring(0, 2000));

  // Verificar opções de Incapacidade de Produção
  const hasIncapacidade = step2Text.includes('Incapacidade de produção') || step2Text.includes('incapacidade de produção');
  console.log('Opção Incapacidade de Produção presente:', hasIncapacidade);

  // Selecionar a modalidade Incapacidade de Produção
  const incRadio = page.locator('text=Incapacidade de produção').first();
  if (await incRadio.count() > 0) {
    await incRadio.click();
    await page.waitForTimeout(1500);
  }

  // Grande Consumidor = Não
  const gcRadio = page.locator('text=Grande Consumidor').locator('..').locator('..').getByText('Não', { exact: true }).first();
  if (await gcRadio.count() > 0) {
    await gcRadio.click();
    await page.waitForTimeout(1000);
  }

  const afterModalidadeText = await page.locator('main').innerText();
  console.log('\nTexto após selecionar Incapacidade de Produção:\n', afterModalidadeText.substring(0, 2000));

  await page.screenshot({ path: 'qa/screenshots/teste-04-crf-step2.png' });

  await browser.close();
})();
