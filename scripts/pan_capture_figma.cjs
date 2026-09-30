const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const outDir = path.join(__dirname, '..', 'figma_inspection', 'detailed_screens');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
  } catch (err) {
    console.error('Erro CDP:', err.message);
    process.exit(1);
  }

  const contexts = browser.contexts ? browser.contexts() : [browser];
  const pages = contexts[0].pages();
  const figmaPage = pages.find((p) => p.url().includes('figma.com'));

  if (!figmaPage) {
    console.error('Figma nao encontrado');
    process.exit(1);
  }

  await figmaPage.bringToFront();

  // 1. Garantir que estamos na página de TELAS (1 PageDown a partir do topo)
  console.log('Navegando para o topo das páginas...');
  for (let i = 0; i < 8; i++) {
    await figmaPage.keyboard.press('PageUp');
    await figmaPage.waitForTimeout(150);
  }
  await figmaPage.waitForTimeout(500);

  console.log('Avançando 1 página para TELAS...');
  await figmaPage.keyboard.press('PageDown');
  await figmaPage.waitForTimeout(1500);

  // 2. Dar zoom to fit (Shift + 1)
  await figmaPage.keyboard.press('Shift+1');
  await figmaPage.waitForTimeout(1500);

  // 3. Focar no canvas clicando no centro
  const vp = figmaPage.viewportSize() || { width: 1440, height: 900 };
  const cx = vp.width / 2;
  const cy = vp.height / 2;
  await figmaPage.mouse.click(cx, cy);
  await figmaPage.waitForTimeout(300);

  // 4. Vamos dar Zoom In (tecla + ou = repetidas vezes) para ver os detalhes
  console.log('Aplicando Zoom In...');
  for (let z = 0; z < 5; z++) {
    await figmaPage.keyboard.press('+');
    await figmaPage.waitForTimeout(300);
  }

  // 5. Capturar varredura panorâmica:
  // Movemos o canvas usando Shift + Wheel (horizontal) e Wheel (vertical)
  // Ou navegando com Space + Drag
  console.log('Iniciando varredura das telas em alta resolução...');

  // Reset para o canto superior esquerdo do canvas (Home e DAES)
  // No Figma, Shift + seta move 10px, ou Shift + wheel faz pan
  for (let r = 1; r <= 8; r++) {
    await figmaPage.screenshot({ path: path.join(outDir, `pan_view_${r}.png`) });
    console.log(`Salvo pan_view_${r}.png`);

    // Pan horizontal para a direita
    await figmaPage.mouse.wheel(1500, 0);
    await figmaPage.waitForTimeout(800);
  }

  // Desce um pouco para ver as telas de baixo (Formulários / Wizard)
  console.log('Descendo para a linha de formulários e cadastros...');
  await figmaPage.mouse.wheel(-12000, 1800); // volta pra esquerda e desce
  await figmaPage.waitForTimeout(1000);

  for (let r = 9; r <= 16; r++) {
    await figmaPage.screenshot({ path: path.join(outDir, `pan_view_${r}.png`) });
    console.log(`Salvo pan_view_${r}.png`);

    // Pan horizontal para a direita
    await figmaPage.mouse.wheel(1500, 0);
    await figmaPage.waitForTimeout(800);
  }

  console.log('Varredura completa!');
  browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
