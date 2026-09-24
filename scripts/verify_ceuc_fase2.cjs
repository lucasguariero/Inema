const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'prints_ceuc_fase2');
  const qaDir = path.join(__dirname, '..', 'qa', 'cards', 'ceuc-fase-2', 'prints');
  
  for (const d of [screenshotsDir, qaDir]) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }

  console.log('Iniciando Vite Preview na porta 4176...');
  const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4176'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    console.log('Acessando http://localhost:4176/?modulo=ceuc...');
    await page.goto('http://localhost:4176/?modulo=ceuc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Clicar em "+ Nova UC" para abrir a TL002
    console.log('Clicando em "+ Nova UC"...');
    const btnNovaUc = page.locator('button:has-text("Nova UC")');
    await btnNovaUc.click();
    await page.waitForTimeout(800);

    // Captura Print 01: Formulário Nova UC com Seção 1 e Seção 2
    console.log('Capturando Print 01: TL002 - Formulário Nova UC...');
    await page.screenshot({ path: path.join(screenshotsDir, '01_tl002_nova_uc.png'), fullPage: false });
    await page.screenshot({ path: path.join(qaDir, 'Print 01 - TL002 Formulario Nova UC Secao 1 e 2.png'), fullPage: false });

    // 2. Navegação para Aba 2 (Instrumentos de Gestão - Estruturada)
    console.log('Navegando para Aba "Instrumentos de Gestão"...');
    const tabInstrumentos = page.locator('button:has-text("Instrumentos de Gestão")').first();
    if (await tabInstrumentos.count() > 0) {
      await tabInstrumentos.click();
      await page.waitForTimeout(500);
      console.log('Capturando Print 02: Aba Instrumentos de Gestão estruturada...');
      await page.screenshot({ path: path.join(screenshotsDir, '02_tl002_aba_instrumentos.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 02 - TL002 Aba Instrumentos de Gestao Estruturada.png'), fullPage: false });

      // Retornar para Aba 1
      const btnRetornar = page.locator('button:has-text("Retornar para Informações Gerais")');
      if (await btnRetornar.count() > 0) {
        await btnRetornar.click();
        await page.waitForTimeout(400);
      }
    }

    // 3. Preencher dados e Salvar Rascunho
    console.log('Preenchendo nome da nova UC e salvando rascunho...');
    const inputNome = page.locator('input[placeholder*="Ex: Parque Estadual"]');
    if (await inputNome.count() > 0) {
      await inputNome.fill('Parque Estadual da Serra do Barbado');
    }
    const btnSalvar = page.locator('button:has-text("Salvar Rascunho")');
    if (await btnSalvar.count() > 0) {
      await btnSalvar.click();
      await page.waitForTimeout(1000);
      console.log('Capturando Print 03: Retorno à lista com toast de confirmação...');
      await page.screenshot({ path: path.join(screenshotsDir, '03_tl002_rascunho_salvo.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 03 - TL002 Retorno Lista com Rascunho Salvo.png'), fullPage: false });
    }

    // 4. Testar Ação "Editar" em uma UC existente (Parque Estadual do Morro do Chapéu)
    console.log('Clicando em "Editar" na UC existente...');
    const btnEditar = page.locator('button:has-text("Editar")');
    if (await btnEditar.count() > 0) {
      await btnEditar.first().click();
      await page.waitForTimeout(800);
      console.log('Capturando Print 04: Formulário em modo Edição com dados populados...');
      await page.screenshot({ path: path.join(screenshotsDir, '04_tl002_edicao_uc.png'), fullPage: false });
      await page.screenshot({ path: path.join(qaDir, 'Print 04 - TL002 Edicao UC Existente Preenchida.png'), fullPage: false });
    }

    console.log('Todas as capturas da Fase 2 foram concluídas com sucesso!');
  } catch (err) {
    console.error('Erro na automação da Fase 2:', err);
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch(console.error);
