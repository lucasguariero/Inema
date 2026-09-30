const { chromium } = require('playwright');
const { attachNetworkLogger } = require('../utils/qa-helper');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';
fs.mkdirSync(PRINTS_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const logger = attachNetworkLogger(page);

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Step 1 - fill
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(1500);

  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("SILOS E ARMAZÉNS")').click();
  await page.waitForTimeout(2000);

  await page.locator('button#form\\.ansa_empr_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Fazenda Demo ANSLA")').click();
  await page.waitForTimeout(1500);

  // Mark ALL checkboxes
  const allCheckboxes = await page.locator('input[type="checkbox"]').all();
  console.log('Total checkboxes found:', allCheckboxes.length);
  for (let i = 0; i < allCheckboxes.length; i++) {
    try {
      const isVis = await allCheckboxes[i].isVisible();
      const isChecked = await allCheckboxes[i].isChecked();
      console.log(`  Checkbox ${i}: visible=${isVis} checked=${isChecked}`);
      if (!isChecked) {
        await allCheckboxes[i].check({ force: true });
        console.log(`  -> Checked checkbox ${i}`);
        await page.waitForTimeout(300);
      }
    } catch (e) {
      console.log(`  -> Error checking ${i}:`, e.message.substring(0, 100));
    }
  }
  await page.waitForTimeout(1000);

  await page.screenshot({ path: PRINTS_DIR + '/step1-all-checked.png' });

  // Click Próximo
  console.log('Clicking Próximo...');
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);

  // Check if we moved to step 2
  const mainText = await page.locator('form[wire\\:submit="save"]').innerText();
  const onStep2 = mainText.includes('Responsável Técnico') || mainText.includes('CNAE') || mainText.includes('Operações');
  console.log('Advanced to Step 2:', onStep2);
  
  if (!onStep2) {
    console.log('Still on Step 1. Error messages:');
    const errors = await page.locator('.text-danger, .fi-fo-field-wrp-error-message, [class*="error"]').allInnerTexts();
    console.log('Errors:', errors);
    console.log('Main text (last 500):', mainText.substring(mainText.length - 500));
  } else {
    console.log('Step 2 text (first 4000):', mainText.substring(0, 4000));
  }

  await page.screenshot({ path: PRINTS_DIR + '/after-proximo.png' });
  await browser.close();
})();
