const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const printsDir = path.resolve(__dirname, '../card-sorting/prints');
  if (!fs.existsSync(printsDir)) fs.mkdirSync(printsDir, { recursive: true });

  console.log('Iniciando Next.js em produção na porta 3005...');
  const server = spawn('npx', ['next', 'start', '-p', '3005'], {
    cwd: path.resolve(__dirname, '../card-sorting'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      const out = data.toString();
      console.log('[Next.js]', out.trim());
      if (out.includes('3005') || out.includes('Ready') || out.includes('started')) resolve();
    });
    server.stderr.on('data', (data) => {
      console.error('[Next.js Err]', data.toString().trim());
    });
    setTimeout(resolve, 5000);
  });

  console.log('Iniciando navegador Playwright (1920x1080)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();

  try {
    // 1. Tela de Entrada (Identificação)
    console.log('1. Acessando tela de identificação...');
    await page.goto('http://localhost:3005', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(printsDir, '01_identificacao.png') });
    console.log('Salvo: 01_identificacao.png');

    // Preenche identificação
    await page.fill('#name', 'Dr. Eduardo Mendonça (Especialista Ambiental)');
    await page.selectOption('#department', 'Regulação (DIRRE)');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(printsDir, '02_identificacao_preenchida.png') });
    console.log('Salvo: 02_identificacao_preenchida.png');

    // Inicia Card Sorting
    await page.click('button:has-text("Iniciar Card Sorting")');
    await page.waitForTimeout(1500);

    // 2. Tela Principal do Card Sorting
    console.log('2. Acessando tela principal do Card Sorting...');
    await page.screenshot({ path: path.join(printsDir, '03_card_sorting_board.png') });
    console.log('Salvo: 03_card_sorting_board.png');

    // Criar um novo grupo
    console.log('3. Criando novo grupo...');
    await page.click('button:has-text("Novo Grupo")');
    await page.waitForTimeout(400);
    await page.fill('input[placeholder="Nome do novo grupo..."]', 'Licenciamento & Atos Florestais');
    await page.click('button:has-text("Criar")');
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(printsDir, '04_novo_grupo_criado.png') });
    console.log('Salvo: 04_novo_grupo_criado.png');

    // Clicar em Salvar Estrutura
    console.log('4. Clicando em Salvar Estrutura...');
    await page.click('button:has-text("Salvar Estrutura")');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(printsDir, '05_modal_salvar_estrutura_json.png') });
    console.log('Salvo: 05_modal_salvar_estrutura_json.png');

    console.log('\n=== VALIDAÇÃO VISUAL DO CARD SORTING CONCLUÍDA COM SUCESSO! ===');
  } catch (err) {
    console.error('Erro na validação:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main();
