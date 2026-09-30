const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

async function main() {
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

  // Clica no dropdown de páginas no topo esquerdo (botão com ícone de página ao lado de 'Seia Plataforma')
  console.log('Abrindo menu de páginas...');
  const titleBox = await figmaPage.locator('text=Seia Plataforma').first().boundingBox();
  if (titleBox) {
    // Clica um pouco à direita ou no próprio título
    await figmaPage.mouse.click(titleBox.x + titleBox.width + 15, titleBox.y + titleBox.height / 2);
    await figmaPage.waitForTimeout(1000);
  }

  // Tenta capturar screenshot do menu aberto
  await figmaPage.screenshot({ path: path.join(__dirname, '..', 'figma_inspection', 'menu_paginas_aberto.png') });

  // Lista todos os textos de páginas do menu popup se estiver aberto
  const popupItems = await figmaPage.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], [class*="menu_item"], [class*="option"], [class*="row"]'));
    return items.map(el => el.textContent.trim()).filter(Boolean);
  });
  console.log('Itens do menu popup:', popupItems);

  browser.close();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
