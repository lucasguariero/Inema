const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'figma_inspection');
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
  await figmaPage.waitForTimeout(1000);

  // 1. Abrir o painel esquerdo de páginas/layers se estiver fechado
  // O botão de painel fica ao lado do título "Seia Plataforma" no topo esquerdo
  console.log('Procurando botão de painel/páginas no Figma...');
  const panelToggle = figmaPage.locator('button[aria-label*="panel"], button[aria-label*="sidebar"], [data-testid*="sidebar-toggle"], [class*="title_bar"] button').first();
  if (await panelToggle.count() > 0) {
    await panelToggle.click();
    await figmaPage.waitForTimeout(1000);
  } else {
    // Atalho do Figma para abrir/fechar layers/sidebar: Alt + 1 ou Ctrl + \ ou Command + \
    await figmaPage.keyboard.press('Control+\\');
    await figmaPage.waitForTimeout(1000);
  }

  await figmaPage.screenshot({ path: path.join(screenshotsDir, '04_painel_aberto.png') });

  // Listar todas as páginas clicando no dropdown de páginas se houver
  const pageDropdown = figmaPage.locator('[class*="page_name"], [data-testid*="page-name"], [class*="pageList"], [class*="pages_panel"]').first();
  console.log('Page dropdown count:', await pageDropdown.count());

  // Também podemos tentar trocar de página usando os atalhos do Figma:
  // PageDown / PageUp troca entre páginas no Figma!
  console.log('Navegando entre as páginas do Figma usando PageDown...');
  for (let i = 1; i <= 10; i++) {
    await figmaPage.keyboard.press('PageDown');
    await figmaPage.waitForTimeout(2000);
    await figmaPage.keyboard.press('Shift+1'); // Zoom to fit
    await figmaPage.waitForTimeout(2000);
    
    const pageTitle = await figmaPage.evaluate(() => {
      const pageEl = document.querySelector('[class*="page_row"][class*="selected"], [class*="page_name"], [aria-current="page"]');
      return pageEl ? pageEl.textContent.trim() : null;
    });
    console.log(`Pagina ${i} detectada:`, pageTitle);
    await figmaPage.screenshot({ path: path.join(screenshotsDir, `page_${i}_fit.png`) });
  }

  console.log('Dumping concluído!');
  // Fechar conexao CDP e finalizar processo
  browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
