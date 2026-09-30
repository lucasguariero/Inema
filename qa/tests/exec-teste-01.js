const { chromium } = require('playwright');
const fs = require('fs');

const CARD_DIR = 'qa/cards/card-ansla-config-tramitacao';
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

  console.log('=== TESTE 01: INICIANDO EXECUÇÃO ===');
  await login(page, '00000000000', 'admin123');

  // 1. Navegar pelo menu até Administração > Processo ANSLA / Tipos de Atividade
  console.log('\n1. Navegando para Administração > Tipos de Atividade...');
  // Check sidebar navigation
  await page.goto('https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const pageTitle = await page.title();
  console.log('Título da tela de listagem:', pageTitle);
  const listText = await page.locator('main').innerText();
  console.log('Listagem (primeiros 1500 chars):\n', listText.substring(0, 1500));

  // Verificar colunas da tabela conforme Figma TL001 (Código, Descrição, Situação, Ações)
  const headers = await page.locator('table thead th').allInnerTexts();
  console.log('Colunas da tabela:', headers);

  // 2. Abrir o formulário de cadastro ou edição para inspecionar as abas
  console.log('\n2. Abrindo tela de criação de Tipo de Atividade...');
  const createBtn = page.getByRole('link', { name: /criar|cadastrar|novo/i }).first();
  if (await createBtn.count() > 0) {
    await createBtn.click();
    await page.waitForTimeout(2000);
  } else {
    // Tentar via URL direta
    await page.goto('https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  }

  console.log('URL da criação:', page.url());
  const formText = await page.locator('main').innerText();
  console.log('Texto da criação (primeiros 1500 chars):\n', formText.substring(0, 1500));

  // Verificar as 4 abas conforme Figma TL002 a TL005
  const tabs = await page.locator('[role="tab"], .fi-sc-wizard-header-step, button:has-text("Atividade"), button:has-text("Instruções"), button:has-text("Documentos"), button:has-text("Setor")').allInnerTexts();
  console.log('Abas encontradas:', tabs);

  // 3. Inspecionar a aba Setor e a Ordem de Análise
  console.log('\n3. Inspecionando Aba Setor e Ordem de Análise...');
  const setorTab = page.locator('button:has-text("Setor"), [role="tab"]:has-text("Setor")').first();
  if (await setorTab.count() > 0) {
    await setorTab.click();
    await page.waitForTimeout(1500);
  }

  const setorSectionText = await page.locator('main').innerText();
  console.log('Seção de Setor (primeiros 1500 chars):\n', setorSectionText.substring(0, 1500));

  // 4. Inspecionar edição de um tipo de atividade já existente (ex: ANSLA-003 Silos)
  console.log('\n4. Inspecionando Edição de Tipo de Atividade existente com processos...');
  await page.goto('https://gla-inema-hml.acto.com.br/tipo-atividade-ansla/tipo-atividade-anslas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Procurar linha de Silos e Armazéns ou QA Teste
  const editLink = page.locator('a:has-text("Editar"), [title="Editar"], button[title="Editar"]').first();
  if (await editLink.count() > 0) {
    await editLink.click();
    await page.waitForTimeout(2500);
    console.log('URL de edição:', page.url());
    const editFormText = await page.locator('main').innerText();
    console.log('Texto na edição:\n', editFormText.substring(0, 1500));
  }

  // 5. Verificar tela de tramitação / Pauta de Análise do ANSLA
  console.log('\n5. Verificando Pauta de Tramitação de Processos ANSLA...');
  await page.goto('https://gla-inema-hml.acto.com.br/ansla/tela-inicial', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Tela inicial ANSLA URL:', page.url());
  const pautaText = await page.locator('main').innerText();
  console.log('Pauta texto (primeiros 1500 chars):\n', pautaText.substring(0, 1500));

  console.log('\n=== TESTE 01: SCRIPT DE MAPEAMENTO CONCLUÍDO COM SUCESSO ===');
  await browser.close();
})();
