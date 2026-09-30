const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Verificar quais certidões existem no sistema
  for (let id = 1; id <= 12; id++) {
    await page.goto(`https://gla-inema-hml.acto.com.br/certidao-debito-ambiental/dae?certidao=${id}`, { waitUntil: 'networkidle' });
    const title = await page.title();
    if (!title.includes('Not Found') && !title.includes('404')) {
      const text = (await page.innerText('body')).replace(/\n+/g, ' | ');
      const matchProcesso = text.match(/Número do processo\s+([^\s|]+)/);
      const matchSituacao = text.match(/Situação\s+([^\s|]+)/);
      console.log(`Certidão ID ${id}: Processo = ${matchProcesso ? matchProcesso[1] : 'N/A'}, Situação = ${matchSituacao ? matchSituacao[1] : 'N/A'}`);
    } else {
      console.log(`Certidão ID ${id}: 404`);
    }
  }

  await browser.close();
})();
