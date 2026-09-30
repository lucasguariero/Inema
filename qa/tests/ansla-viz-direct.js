const { chromium } = require('playwright');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // ===== VISUALIZAR ANSLA-032 =====
  console.log('========== Visualizar ANSLA-032 ==========');
  await page.goto('https://gla-inema-hml.acto.com.br/ansla/anslas/32', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const vizTitle = await page.title();
  console.log('Title:', vizTitle);
  
  const mainText = await page.locator('main').innerText();
  console.log('\nVisualizar text:\n', mainText.substring(0, 4000));

  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-top.png', fullPage: false });
  
  // Scroll to middle
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-mid.png' });

  // Scroll more
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/05-visualizar-bottom.png' });

  // Check key data in Visualizar
  console.log('\n--- Checklist Visualizar ---');
  console.log('Atividade Não Sujeita:', mainText.includes('Atividade Não Sujeita'));
  console.log('Silos:', mainText.includes('SILOS') || mainText.includes('Silos'));
  console.log('Utiliza água:', mainText.toLowerCase().includes('utiliza') || mainText.toLowerCase().includes('água'));
  console.log('Caracterização:', mainText.includes('Caracterização') || mainText.includes('caracterização'));
  console.log('Unidade armazenadora:', mainText.toLowerCase().includes('unidade') || mainText.toLowerCase().includes('armazenadora'));
  console.log('Responsável Técnico:', mainText.includes('Responsável Técnico') || mainText.includes('responsável técnico'));

  // Now get FULL page text
  console.log('\n\nFull main text length:', mainText.length);
  if (mainText.length > 4000) {
    console.log('Text 4000-8000:', mainText.substring(4000, 8000));
  }

  // ===== VISUALIZAR ANSLA-041 (more recent Concluído) =====
  console.log('\n========== Visualizar ANSLA-041 ==========');
  await page.goto('https://gla-inema-hml.acto.com.br/ansla/anslas/41', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const viz41Title = await page.title();
  console.log('Title:', viz41Title);
  
  const main41Text = await page.locator('main').innerText();
  console.log('ANSLA-041 text (first 3000):', main41Text.substring(0, 3000));

  await page.screenshot({ path: PRINTS_DIR + '/06-visualizar-041.png', fullPage: false });

  console.log('\n=== DONE ===');
  await browser.close();
})();
