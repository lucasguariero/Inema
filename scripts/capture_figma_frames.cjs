const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'figma_inspection', 'screens_detail');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
  } catch (err) {
    console.error('Falha ao conectar:', err.message);
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
  
  // Voltar para a página 1 (Pressionar PageUp 10 vezes)
  console.log('Voltando para a página 1 (telas)...');
  for (let i = 0; i < 10; i++) {
    await figmaPage.keyboard.press('PageUp');
    await figmaPage.waitForTimeout(300);
  }
  await figmaPage.waitForTimeout(1000);
  await figmaPage.keyboard.press('Shift+1'); // Zoom to fit
  await figmaPage.waitForTimeout(1500);

  // Selecionar e dar zoom em frames específicos se possível, ou dar zoom e pan
  // Pressionar 'N' ou ']' avança entre frames no Figma!
  // No Figma: ']' seleciona o próximo sibling frame!
  console.log('Navegando e capturando frames individuais com Shift+2 (Zoom to selection)...');
  
  // Clica no centro para focar canvas
  await figmaPage.mouse.click(500, 400);
  await figmaPage.waitForTimeout(500);

  // Pressionar Tab ou Enter para selecionar nós dentro do canvas
  await figmaPage.keyboard.press('Enter');
  await figmaPage.waitForTimeout(500);

  for (let f = 1; f <= 15; f++) {
    // Zoom to selection
    await figmaPage.keyboard.press('Shift+2');
    await figmaPage.waitForTimeout(1500);
    
    // Captura o frame atual em zoom
    const framePath = path.join(screenshotsDir, `frame_${f}.png`);
    await figmaPage.screenshot({ path: framePath });
    console.log(`Frame ${f} capturado em: ${framePath}`);

    // Ir para o próximo frame (atalho Tab ou ])
    await figmaPage.keyboard.press('Tab');
    await figmaPage.waitForTimeout(800);
  }

  console.log('Captura detalhada concluída com sucesso!');
  browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
