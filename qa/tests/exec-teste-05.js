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

  console.log('=== TESTE 05: DTRP RESUMO PDF ===');
  await login(page, '00000000000', 'admin123');

  // 1. Acessar DTRP Requerimentos
  console.log('1. Acessando Declaração de Transportes > Requerimentos...');
  await page.goto('https://gla-inema-hml.acto.com.br/dtrp-requerimento/dtrp-requerimentos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const listText = await page.locator('body').innerText();
  console.log('Listagem DTRP (primeiros 1500 chars):\n', listText.substring(0, 1500));

  // Inspecionar links / botões de ação nas linhas
  const rows = await page.locator('table tbody tr').all();
  console.log('Total de requerimentos DTRP encontrados:', rows.length);

  // Procurar por botão de Visualizar, Baixar Resumo ou Imprimir PDF
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const rText = (await rows[i].innerText()).trim().replace(/\n/g, ' | ');
    console.log(`  Row [${i}]: ${rText.substring(0, 150)}`);
  }

  // Clicar no primeiro requerimento ou no botão de visualizar
  const viewLink = page.locator('table tbody tr a, table tbody tr button[title*="Visualizar"], a:has-text("Visualizar")').first();
  if (await viewLink.count() > 0) {
    console.log('\nAbrindo visualização de requerimento DTRP...');
    await viewLink.click();
    await page.waitForTimeout(3000);

    console.log('URL de visualização:', page.url());
    const detailText = await page.locator('main, body').innerText();
    console.log('Texto na visualização (primeiros 1500 chars):\n', detailText.substring(0, 1500));

    // Procurar botão de Download / Gerar Resumo PDF
    const pdfButtons = await page.locator('a:has-text("PDF"), a:has-text("Resumo"), button:has-text("PDF"), button:has-text("Resumo"), a:has-text("Baixar"), a:has-text("Imprimir")').all();
    console.log('\nBotões de PDF encontrados:', pdfButtons.length);
    for (const b of pdfButtons) {
      console.log('  Botão PDF:', (await b.innerText()).trim(), 'href:', await b.getAttribute('href'));
    }

    // Se houver botão de download/resumo, interceptar o download
    const downloadBtn = page.locator('a:has-text("Resumo"), button:has-text("Resumo"), a:has-text("Baixar"), a[href*="pdf"]').first();
    if (await downloadBtn.count() > 0) {
      console.log('Tentando baixar o resumo PDF...');
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
        downloadBtn.click()
      ]);
      if (download) {
        const path = await download.path();
        console.log('Download concluído com sucesso! Caminho temporário:', path);
        const savePath = 'qa/cards/card-dtrp-resumo-pdf/resumo_dtrp_baixado.pdf';
        await download.saveAs(savePath);
        console.log('PDF salvo em:', savePath);
        console.log('Tamanho do PDF:', fs.statSync(savePath).size, 'bytes');
      } else {
        console.log('Download direto não disparado via evento (pode ser link ou nova aba).');
      }
    }
  }

  await browser.close();
})();
