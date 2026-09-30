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

  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Find all action links/buttons for ANSLA-032
  const row32 = page.locator('tr:has-text("ANSLA-2026-000032")').first();
  console.log('Row 032 found:', await row32.count() > 0);
  
  // Get all links in that row
  const links32 = await row32.locator('a').all();
  console.log('Links in row 032:');
  for (const l of links32) {
    const text = (await l.innerText()).trim();
    const href = await l.getAttribute('href');
    console.log(`  "${text}" => ${href}`);
  }

  // Also check for kebab/action buttons
  const btns32 = await row32.locator('button').all();
  console.log('Buttons in row 032:', btns32.length);
  for (const b of btns32) {
    const text = (await b.innerText()).trim();
    console.log(`  btn: "${text.substring(0, 40)}"`);
  }

  // Also check for row 041 (Concluído)
  const row41 = page.locator('tr:has-text("ANSLA-2026-000041")').first();
  const links41 = await row41.locator('a').all();
  console.log('\nLinks in row 041:');
  for (const l of links41) {
    const text = (await l.innerText()).trim();
    const href = await l.getAttribute('href');
    console.log(`  "${text}" => ${href}`);
  }

  // Try direct URL patterns
  const testUrls = [
    'https://gla-inema-hml.acto.com.br/atividades-dispensadas/visualizar?record=32',
    'https://gla-inema-hml.acto.com.br/atividades-dispensadas/32',
    'https://gla-inema-hml.acto.com.br/atividades-dispensadas/32/visualizar',
  ];
  
  for (const url of testUrls) {
    console.log('\nTrying:', url);
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    console.log('  Status:', resp.status(), 'URL:', page.url());
    if (resp.status() === 200 && !page.url().includes('login')) {
      const title = await page.title();
      console.log('  Title:', title);
      break;
    }
  }

  await browser.close();
})();
