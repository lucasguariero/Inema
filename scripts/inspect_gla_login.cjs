const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function inspectGlaLogin() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  console.log('Navigating to GLA login...');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const screenshotPath = path.join(__dirname, '../qa/gla-login-reference.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Get HTML structure of login form
  const loginHtml = await page.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('.fi-simple-main') || document.body;
    return {
      title: document.title,
      html: main.innerHTML.slice(0, 3000),
      forms: Array.from(document.querySelectorAll('form')).map(f => ({
        inputs: Array.from(f.querySelectorAll('input')).map(i => ({
          name: i.name,
          type: i.type,
          placeholder: i.placeholder,
          id: i.id
        })),
        buttons: Array.from(f.querySelectorAll('button')).map(b => b.innerText.trim())
      }))
    };
  });

  console.log('GLA Login Details:', JSON.stringify(loginHtml, null, 2));

  await browser.close();
}

inspectGlaLogin().catch(err => {
  console.error(err);
  process.exit(1);
});
