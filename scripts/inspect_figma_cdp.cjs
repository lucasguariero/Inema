const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'figma_inspection');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('Tentando conectar ao Chrome via CDP na porta 9222...');
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('Conectado com sucesso ao Chrome aberto!');
  } catch (err) {
    console.log('Nao foi possivel conectar via porta 9222:', err.message);
    console.log('Tentando abrir com o perfil persistente...');
    const profileDir = path.join(__dirname, '..', '.figma_chrome_profile');
    browser = await chromium.launchPersistentContext(profileDir, {
      headless: true,
      channel: 'chrome',
      viewport: { width: 1920, height: 1080 }
    });
  }

  const contexts = browser.contexts ? browser.contexts() : [browser];
  const pages = contexts[0].pages();
  console.log(`Abas abertas no navegador: ${pages.length}`);

  let figmaPage = pages.find((p) => p.url().includes('figma.com'));
  if (!figmaPage) {
    console.log('Aba do Figma nao encontrada aberta. Navegando para o link...');
    figmaPage = await contexts[0].newPage();
    await figmaPage.goto('https://www.figma.com/design/P1fGiOC8rswWDiadWdMORL/Seia-Plataforma?node-id=3-5&t=PkRuOSVLMm5ZtGwL-1', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
  } else {
    console.log('Aba do Figma localizada:', figmaPage.url());
  }

  await figmaPage.bringToFront();
  console.log('Aguardando 5 segundos para estabilizacao do canvas do Figma...');
  await figmaPage.waitForTimeout(5000);

  const title = await figmaPage.title();
  const url = figmaPage.url();
  console.log('Titulo da Pagina:', title);
  console.log('URL da Pagina:', url);

  // Captura geral da tela do Figma
  const overviewPath = path.join(screenshotsDir, '01_figma_overview.png');
  await figmaPage.screenshot({ path: overviewPath, fullPage: false });
  console.log(`Print salvo em: ${overviewPath}`);

  // Inspecionar nós ou texto visíveis no Figma
  // Figma desenha no canvas webgl, mas os painéis de navegação e layers à esquerda são HTML!
  try {
    const layerNames = await figmaPage.evaluate(() => {
      // Coleta nomes de layers, frames ou páginas no painel lateral do Figma se presentes no DOM
      const elements = Array.from(document.querySelectorAll('[class*="layer_row"], [class*="tree_row"], [data-testid*="layer"], [class*="page_row"]'));
      return elements.map(el => el.textContent.trim()).filter(Boolean).slice(0, 50);
    });
    console.log('Layers/Frames detectados no painel lateral:', layerNames);
    fs.writeFileSync(path.join(screenshotsDir, 'layers.json'), JSON.stringify(layerNames, null, 2));
  } catch (e) {
    console.log('Nao foi possivel extrair layers via DOM:', e.message);
  }

  // Tentar dar zoom para focar se possivel ou capturar diferentes áreas usando atalhos de navegação
  // Ex: Shift + 1 (Zoom to fit)
  try {
    console.log('Enviando Shift+1 para enquadrar todo o canvas...');
    await figmaPage.keyboard.press('Shift+1');
    await figmaPage.waitForTimeout(3000);
    await figmaPage.screenshot({ path: path.join(screenshotsDir, '02_figma_zoom_fit.png') });

    // Shift + 2 (Zoom to selection)
    console.log('Enviando Shift+2 para dar zoom no nó selecionado...');
    await figmaPage.keyboard.press('Shift+2');
    await figmaPage.waitForTimeout(3000);
    await figmaPage.screenshot({ path: path.join(screenshotsDir, '03_figma_zoom_selection.png') });
  } catch (e) {
    console.log('Erro ao enviar comandos de zoom:', e.message);
  }

  console.log('Inspeção inicial concluída com segurança (modo estritamente LEITURA)!');
}

main().catch(console.error);
