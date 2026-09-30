const { chromium } = require('playwright');
const { attachNetworkLogger } = require('../utils/qa-helper');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';
fs.mkdirSync(PRINTS_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const logger = attachNetworkLogger(page);

  // ===== LOGIN =====
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
  console.log('Logged in. URL:', page.url());

  // ===== BLOCO 1: VERIFICAR NOMENCLATURA NO MENU =====
  console.log('\n=== BLOCO 1: Padronização de Nomenclatura ===');
  
  // Check sidebar menu text
  const sidebarText = await page.locator('nav, aside').allInnerTexts();
  const fullSidebar = sidebarText.join(' ');
  const hasANSLAMenu = fullSidebar.includes('Atividades Não Sujeitas a Licenciamento Ambiental') || 
                        fullSidebar.includes('Atividades Não Sujeitas');
  console.log('[1.1] Menu lateral contém "Atividades Não Sujeitas a Licenciamento Ambiental":', hasANSLAMenu);

  // Navigate to info page and check title
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const pageTitle = await page.title();
  console.log('[1.1] Page title:', pageTitle);
  const titleOk = pageTitle.includes('Atividades Não Sujeitas a Licenciamento Ambiental');
  console.log('[1.1] Title check PASS:', titleOk);

  // Navigate to cadastro
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const cadastroTitle = await page.title();
  console.log('[1.2] Cadastro page title:', cadastroTitle);
  const cadastroTitleOk = cadastroTitle.includes('Cadastrar Atividade Não Sujeita a Licenciamento Ambiental');
  console.log('[1.2] Cadastro title PASS:', cadastroTitleOk);

  // Check breadcrumb text
  const breadcrumbTexts = await page.locator('a, span').allInnerTexts();
  const hasMeusProcessos = breadcrumbTexts.some(t => t.includes('Meus Processos'));
  console.log('[1.2] Breadcrumb "Meus Processos" present:', hasMeusProcessos);

  // ===== STEP 1: DADOS BÁSICOS =====
  console.log('\n=== STEP 1: Dados Básicos ===');
  
  console.log('[1.3] Selecionando Tipo de Responsável...');
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(1500);

  console.log('[1.3] Selecionando Tipo de Atividade SILOS E ARMAZÉNS...');
  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("SILOS E ARMAZÉNS")').click();
  await page.waitForTimeout(2000);
  const tatiText = (await page.locator('button#form\\.ansa_tati_id').innerText()).trim();
  console.log('[1.3] Tipo de Atividade selecionado:', tatiText);

  console.log('[1.3] Selecionando Empreendimento Fazenda Demo ANSLA...');
  await page.locator('button#form\\.ansa_empr_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Fazenda Demo ANSLA")').click();
  await page.waitForTimeout(1500);
  const emprText = (await page.locator('button#form\\.ansa_empr_id').innerText()).trim();
  console.log('[1.3] Empreendimento selecionado:', emprText);

  console.log('[1.4] Marcando declarações...');
  const checkbox = page.locator('input[type="checkbox"]:visible');
  if (await checkbox.count() > 0) {
    await checkbox.first().check();
    console.log('[1.4] Declaração marcada');
  }
  await page.waitForTimeout(500);

  await page.screenshot({ path: PRINTS_DIR + '/step1-dados-basicos.png' });

  console.log('[1.4] Avançando para Caracterização...');
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);

  // ===== STEP 2: CARACTERIZAÇÃO =====
  console.log('\n=== STEP 2: Caracterização da Atividade ===');
  const step2Text = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('Step 2 text (first 3000 chars):\n', step2Text.substring(0, 3000));

  await page.screenshot({ path: PRINTS_DIR + '/step2-caracterizacao-overview.png' });

  // ===== Check for "Armazém de insumos" in operações (Problema 1) =====
  const hasArmazemInsumos = step2Text.includes('Armazém de insumos');
  const hasAerizacao = step2Text.includes('Aerização de insumos');
  console.log('\n[2.3] Operação "Armazém de insumos" presente:', hasArmazemInsumos);
  console.log('[2.3] Operação "Aerização de insumos" (antigo) presente:', hasAerizacao);
  console.log('[2.3] Problema 1 RESOLVIDO:', hasArmazemInsumos && !hasAerizacao);

  // Log network errors
  console.log('\n=== Network Errors ===');
  console.log(JSON.stringify(logger.errors, null, 2));

  await browser.close();
})();
