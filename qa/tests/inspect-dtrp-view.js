const { chromium } = require('playwright');
const fs = require('fs');

async function login(page, cpf, pwd) {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill(cpf);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await login(page, '00000000000', 'admin123');

  // Acessar visualização do Requerimento 1 (Status: Novo / Finalizado)
  console.log('Acessando visualização do Requerimento 1...');
  await page.goto('https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const main1 = await page.locator('#fi-main-content').innerText();
  console.log('\nTexto Requerimento 1 (primeiros 2000 chars):\n', main1.substring(0, 2000));

  // Procurar botões de ação (ex: Baixar Resumo, Gerar PDF)
  const buttons1 = await page.locator('header button, header a, .fi-ac-btn-action, a:has-text("PDF"), button:has-text("PDF"), a:has-text("Resumo"), button:has-text("Resumo")').all();
  console.log('\nBotões de ação no Requerimento 1:', buttons1.length);
  for (const b of buttons1) {
    console.log('  Botão:', (await b.innerText()).trim(), 'href:', await b.getAttribute('href'));
  }

  // Acessar visualização do Requerimento 2 (Status: Rascunho)
  console.log('\nAcessando visualização do Requerimento 2...');
  await page.goto('https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos/2', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const main2 = await page.locator('#fi-main-content').innerText();
  console.log('Texto Requerimento 2 (primeiros 1500 chars):\n', main2.substring(0, 1500));

  const buttons2 = await page.locator('header button, header a, .fi-ac-btn-action, a:has-text("PDF"), button:has-text("PDF"), a:has-text("Resumo"), button:has-text("Resumo")').all();
  console.log('\nBotões de ação no Requerimento 2:', buttons2.length);
  for (const b of buttons2) {
    console.log('  Botão:', (await b.innerText()).trim(), 'href:', await b.getAttribute('href'));
  }

  // Tentar acionar o download do resumo PDF no requerimento 1 se disponível
  const resumoBtn = page.locator('a:has-text("Resumo"), button:has-text("Resumo"), a:has-text("Baixar"), a[href*="pdf"]').first();
  if (await resumoBtn.count() > 0) {
    console.log('\nClicando no botão de Resumo...');
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
      resumoBtn.click()
    ]);
    if (download) {
      const savePath = 'qa/cards/card-dtrp-resumo-pdf/resumo_dtrp_baixado.pdf';
      await download.saveAs(savePath);
      console.log('PDF baixado e salvo com sucesso em:', savePath);
      console.log('Tamanho:', fs.statSync(savePath).size, 'bytes');
    }
  }

  await browser.close();
})();
