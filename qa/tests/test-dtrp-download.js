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

  await page.goto('https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Localizando botão "Baixar resumo em PDF"...');
  const btn = page.getByRole('button', { name: /Baixar resumo em PDF/i }).first();
  console.log('Botão encontrado:', await btn.count() > 0);

  // Monitorar downloads e requisições de rede
  let pdfDownloaded = false;
  const savePath = 'qa/cards/card-dtrp-resumo-pdf/resumo_dtrp_gerado.pdf';

  page.on('download', async download => {
    console.log('Evento de download disparado!');
    await download.saveAs(savePath);
    console.log('Arquivo salvo com sucesso em:', savePath);
    console.log('Tamanho:', fs.statSync(savePath).size, 'bytes');
    pdfDownloaded = true;
  });

  // Também monitorar se abre nova aba ou response com application/pdf
  page.on('response', async res => {
    const ct = res.headers()['content-type'] || '';
    if (ct.includes('application/pdf') || res.url().includes('resumo') || res.url().includes('pdf')) {
      console.log('Resposta de PDF detectada:', res.status(), res.url(), ct);
      try {
        const buffer = await res.body();
        if (buffer.length > 500) {
          fs.writeFileSync(savePath, buffer);
          console.log('PDF gravado a partir da resposta HTTP! Tamanho:', buffer.length, 'bytes');
          pdfDownloaded = true;
        }
      } catch (e) {}
    }
  });

  console.log('Clicando em "Baixar resumo em PDF"...');
  await btn.click();
  await page.waitForTimeout(8000);

  console.log('Download efetuado com sucesso?', fs.existsSync(savePath));
  if (fs.existsSync(savePath)) {
    console.log('Tamanho final:', fs.statSync(savePath).size, 'bytes');
  }

  await browser.close();
})();
