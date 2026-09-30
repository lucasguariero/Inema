const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Procurar telas de atos ou portarias no menu
  const atoLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim().replace(/\n+/g, ' '),
      href: a.getAttribute('href')
    })).filter(l => l.href && (l.href.includes('ato') || l.href.includes('portaria') || l.href.includes('licen') || l.text.toLowerCase().includes('ato') || l.text.toLowerCase().includes('portaria')));
  });
  console.log('Links relacionados a Atos/Portarias:\n', JSON.stringify(atoLinks, null, 2));

  // Ir na Etapa 4 do processo 8
  await page.goto('https://gla-inema-hml.acto.com.br/processos/8/edit', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1000);
  await page.locator('button:has-text("Próximo")').click();
  await page.waitForTimeout(1500);

  const textStep4 = await page.innerText('main, .fi-main');
  console.log('=== ETAPA 4 (FINALIZAÇÃO) DO PROCESSO 8 ===\n', textStep4.replace(/\n+/g, ' | '));

  await browser.close();
})();
