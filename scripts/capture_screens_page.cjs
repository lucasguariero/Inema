const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'figma_inspection', 'highres_screens');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
  } catch (err) {
    console.error('Falha ao conectar via CDP:', err.message);
    process.exit(1);
  }

  const contexts = browser.contexts ? browser.contexts() : [browser];
  const pages = contexts[0].pages();
  const figmaPage = pages.find((p) => p.url().includes('figma.com'));

  if (!figmaPage) {
    console.error('Aba do Figma nao encontrada');
    process.exit(1);
  }

  await figmaPage.bringToFront();
  
  // Garantir que estamos na primeira página (CAPA)
  for (let i = 0; i < 8; i++) {
    await figmaPage.keyboard.press('PageUp');
    await figmaPage.waitForTimeout(200);
  }
  await figmaPage.waitForTimeout(1000);

  // Agora avançar exatamente UMA página (PageDown) para ir para a página de TELAS
  console.log('Indo para a página de telas (1x PageDown)...');
  await figmaPage.keyboard.press('PageDown');
  await figmaPage.waitForTimeout(2500);

  // Zoom to fit
  await figmaPage.keyboard.press('Shift+1');
  await figmaPage.waitForTimeout(2000);

  // Captura geral da página de telas
  await figmaPage.screenshot({ path: path.join(screenshotsDir, '00_todas_as_telas_grid.png') });

  // Agora vamos dar zoom (Shift + 0 para 100% ou Ctrl+Alt+0 ou Shift+2)
  // Vamos focar no canvas:
  const viewport = figmaPage.viewportSize() || { width: 1920, height: 1080 };
  const centerX = Math.round(viewport.width / 2);
  const centerY = Math.round(viewport.height / 2);

  // Clica duas vezes em diferentes regiões para dar zoom ou usa atalhos de zoom do Figma:
  // '+' (ou '='): Zoom In
  // '-' : Zoom Out
  // 'Shift + 0' : 100% Zoom
  // 'Shift + 1' : Fit
  // 'Shift + 2' : Zoom to selection

  // Vamos navegar frame a frame usando o atalho de seleção do Figma:
  // Clica no centro
  await figmaPage.mouse.click(centerX, centerY);
  await figmaPage.waitForTimeout(500);

  // Pressionar tecla ']' ou '[' navega entre os nós do Figma!
  // E 'Shift + 2' dá zoom diretamente no nó selecionado!
  console.log('Percorrendo nós com atalhos de seleção do Figma...');
  for (let step = 1; step <= 12; step++) {
    await figmaPage.keyboard.press(']'); // Próximo nó
    await figmaPage.waitForTimeout(300);
    await figmaPage.keyboard.press('Shift+2'); // Zoom to selection
    await figmaPage.waitForTimeout(1200);
    await figmaPage.screenshot({ path: path.join(screenshotsDir, `tela_detalhada_${step}.png`) });
    console.log(`Capturada tela detalhada ${step}`);
  }

  console.log('Capturas concluídas com sucesso!');
  browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
