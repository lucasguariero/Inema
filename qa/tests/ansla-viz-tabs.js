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

  await page.goto('https://gla-inema-hml.acto.com.br/ansla/anslas/32', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click "Caracterização da Atividade" tab
  console.log('Clicking Caracterização da Atividade tab...');
  await page.getByText('Caracterização da Atividade').click();
  await page.waitForTimeout(2000);

  const caracText = await page.locator('main').innerText();
  console.log('Caracterização text:\n', caracText);

  await page.screenshot({ path: PRINTS_DIR + '/07-viz-caracterizacao-top.png' });

  // Scroll down
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/07-viz-caracterizacao-mid.png' });

  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: PRINTS_DIR + '/07-viz-caracterizacao-bot.png' });

  // Check key data
  console.log('\n--- Checklist Caracterização no Visualizar ---');
  console.log('Responsável Técnico:', caracText.includes('Responsável Técnico'));
  console.log('CNAE:', caracText.includes('CNAE'));
  console.log('Operações:', caracText.includes('Operações') || caracText.includes('operações'));
  console.log('Armazém de insumos:', caracText.includes('Armazém de insumos'));
  console.log('Combustível:', caracText.includes('Combustível') || caracText.includes('combustível'));
  console.log('Unidade armazenadora:', caracText.includes('Unidade') || caracText.includes('unidade armazenadora'));
  console.log('Efluentes:', caracText.includes('Efluentes') || caracText.includes('efluentes'));
  console.log('Emissões:', caracText.includes('Emissões') || caracText.includes('emissões'));

  // Click "Documentos e Estudos" tab
  console.log('\nClicking Documentos e Estudos tab...');
  await page.getByText('Documentos e Estudos').click();
  await page.waitForTimeout(2000);

  const docsText = await page.locator('main').innerText();
  console.log('Documentos text:', docsText.substring(0, 500));

  await page.screenshot({ path: PRINTS_DIR + '/08-viz-documentos.png' });

  console.log('\n=== DONE ===');
  await browser.close();
})();
