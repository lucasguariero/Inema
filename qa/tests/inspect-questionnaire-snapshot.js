const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('19762424018'); // Caick teste externo
  await page.locator('input[type="password"]').first().fill('admin123'); // ou teste123
  let loggedIn = false;
  try {
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    if (!page.url().includes('login')) loggedIn = true;
  } catch (e) {}

  if (!loggedIn) {
    console.log('Login com caick não deu, logando com admin...');
    await page.goto('https://gla-inema-hml.acto.com.br/login');
    await page.locator('input[type="text"]').first().fill('00000000000');
    await page.locator('input[type="password"]').first().fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2500);
  }

  // Acessar a URL direta com step=form.questionario
  await page.goto('https://gla-inema-hml.acto.com.br/requerimento/identificacao?step=form.questionario%3A%3Adata%3A%3Awizard-step', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Extrair todos os snapshots do Livewire
  const snapshots = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[wire\\:snapshot]')).map(el => {
      try {
        return JSON.parse(el.getAttribute('wire:snapshot'));
      } catch (e) {
        return el.getAttribute('wire:snapshot');
      }
    });
  });

  console.log('Snapshots count:', snapshots.length);
  for (let i = 0; i < snapshots.length; i++) {
    const s = snapshots[i];
    console.log(`Snapshot [${i}] keys:`, Object.keys(s.data || {}));
    if (s.data && s.data.data) {
      console.log(`Snapshot [${i}] data keys:`, Object.keys(s.data.data[0] || {}));
      console.log('Questionario data:', JSON.stringify(s.data.data[0].questionario || {}));
    }
  }

  await browser.close();
})();
