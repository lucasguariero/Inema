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

  // Navigate to Meus Processos
  console.log('--- Meus Processos ---');
  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mainText = await page.locator('main').innerText();
  console.log('Meus Processos text (first 2000):', mainText.substring(0, 2000));

  // Look for ANSLA records in the table
  const rows = await page.locator('table tbody tr, .fi-ta-row').all();
  console.log('\nTable rows count:', rows.length);
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const rowText = (await rows[i].innerText()).trim().replace(/\n/g, ' | ');
    if (rowText.includes('ANSLA') || rowText.includes('Silos') || rowText.includes('armazen') || rowText.includes('Não Sujeita')) {
      console.log(`  Row ${i}: ${rowText.substring(0, 200)}`);
    }
  }

  // Also dump all rows briefly
  console.log('\nAll rows (brief):');
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const rowText = (await rows[i].innerText()).trim().replace(/\n/g, ' | ');
    console.log(`  ${i}: ${rowText.substring(0, 150)}`);
  }

  await page.screenshot({ path: PRINTS_DIR + '/meus-processos.png' });

  // Check for any ANSLA-specific links
  const anslaLinks = await page.locator('a:has-text("ANSLA"), a:has-text("Visualizar"), a:has-text("Editar"), a:has-text("Continuar")').all();
  console.log('\nANSLA/action links:');
  for (const l of anslaLinks) {
    const text = (await l.innerText()).trim();
    const href = await l.getAttribute('href');
    if (text.length < 100) console.log(`  ${text} => ${href}`);
  }

  // Try kebab menu / action buttons
  const kebabs = await page.locator('button[class*="kebab"], button[class*="action"], .fi-ta-actions button').all();
  console.log('\nAction buttons count:', kebabs.length);

  await browser.close();
})();
