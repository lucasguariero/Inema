const { chromium } = require('@playwright/test');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Acessando https://inema.acto.com.br/?escopo=regulacao...');
  await page.goto('https://inema.acto.com.br/?escopo=regulacao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Atividades por técnico
  await page.locator('button:has-text("Atividades por técnico")').first().click();
  await page.waitForTimeout(1000);
  const textTec = await page.textContent('body');
  console.log('NOUT médias visíveis:', textTec.includes('18,4 processos/mês') && textTec.includes('108,1 processos/semestre'));

  // 2. Anual DIRRE
  await page.locator('button:has-text("Anual DIRRE")').first().click();
  await page.waitForTimeout(1000);
  const textDirre = await page.textContent('body');
  console.log('Anual DIRRE 1.482 registros:', textDirre.includes('1.482 registros'));

  // 3. Pauta
  await page.locator('button:has-text("Acompanhamento da pauta")').first().click();
  await page.waitForTimeout(1000);
  const textPauta = await page.textContent('body');
  console.log('Pauta 412 excedido:', textPauta.includes('412') && textPauta.includes('10,7% da pauta em alerta'));
  console.log('FORM-00319 na tabela:', textPauta.includes('FORM-00319'));

  // 4. Detalhar FORM-00319
  const row = page.locator('tr:has-text("FORM-00319")');
  if (await row.count() > 0) {
    await row.locator('button:has-text("Detalhar")').click();
    await page.waitForTimeout(600);
    const drawerText = await page.textContent('body');
    console.log('Drawer "Sem tramitação registrada":', drawerText.includes('Sem tramitação registrada'));
    console.log('Drawer "45 dias":', drawerText.includes('45 dias'));
  }

  await browser.close();
  console.log('Verificação em produção concluída com sucesso!');
}

main();
