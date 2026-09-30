const { chromium } = require('playwright');
const fs = require('fs');

const CARD_DIR = 'qa/cards/card-sispass-meus-perfis';
const PRINTS_DIR = `${CARD_DIR}/prints`;

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

  console.log('=== TESTE 02: INICIANDO EXECUÇÃO (SISPASS MEUS PERFIS) ===');
  await login(page, '00000000000', 'admin123');

  // 1. Acessar Meus Perfis
  console.log('\n1. Acessando SISPASS > Meus Perfis...');
  await page.goto('https://gla-inema-hml.acto.com.br/meus-perfis', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const meusPerfisText = await page.locator('main').innerText();
  console.log('Texto de Meus Perfis (primeiros 1000 chars):\n', meusPerfisText.substring(0, 1000));

  // Clicar em "Criar Perfil" ou navegar direto para o form
  const criarPerfilBtn = page.getByRole('link', { name: /criar perfil|cadastrar novo perfil/i }).first();
  if (await criarPerfilBtn.count() > 0) {
    await criarPerfilBtn.click();
    await page.waitForTimeout(2000);
  } else {
    // Tentar botão
    const btn = page.locator('a:has-text("Criar Perfil"), button:has-text("Criar Perfil")').first();
    if (await btn.count() > 0) await btn.click();
    await page.waitForTimeout(2000);
  }

  console.log('URL de Cadastro de Perfil:', page.url());

  // 2. Inspecionar as opções de Tipo de Perfil
  console.log('\n2. Inspecionando tipos de perfil disponíveis...');
  const perfilSelect = page.locator('select#form\\.pege_tipe_id, select[id*="tipe"], select[id*="perfil"]').first();
  // Se for combobox do Filament
  const perfilBtn = page.locator('button#form\\.pege_tipe_id, button[id*="tipe"], button[id*="perfil"]').first();
  
  if (await perfilSelect.count() > 0) {
    const options = await perfilSelect.locator('option').allInnerTexts();
    console.log('Opções no select de Tipo de Perfil:', options);
  } else if (await perfilBtn.count() > 0) {
    await perfilBtn.click();
    await page.waitForTimeout(600);
    const options = await page.locator('[role="option"]:visible').allInnerTexts();
    console.log('Opções no combobox de Tipo de Perfil:', options);
    await page.keyboard.press('Escape');
  } else {
    // Inspecionar todos os selects/buttons do form
    const elements = await page.locator('select, button[id*="form"]').all();
    for (const el of elements) {
      console.log('Element:', await el.evaluate(e => `${e.tagName} id=${e.id} name=${e.name}`));
    }
  }

  // Dump do HTML do formulário para mapear exatamente os campos
  const formHtml = await page.locator('main').innerHTML();
  console.log('\nForm HTML (primeiros 1000 chars):\n', formHtml.substring(0, 1000));

  await browser.close();
})();
