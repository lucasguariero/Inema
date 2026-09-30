const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 8: Bruno Carvalho notificacao e analise', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('19600000042');
  await page.locator('input[type="password"]').first().fill('@Plantao123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3500);

  // Expandir Fiscalização se necessário
  const fisc = page.locator('button:has-text("Fiscalização"), a:has-text("Fiscalização"), div:has-text("Fiscalização")').first();
  if (await fisc.isVisible().catch(() => false)) {
    await fisc.click();
    await page.waitForTimeout(800);
  }

  // Capturar tela inicial do Bruno com notificação e contador no menu
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 23 - Notificacao e contador Bruno Carvalho.png' });
  console.log('✔ Print 23 capturado: Notificação e contador Bruno Carvalho.');

  // Acessar Fiscalização > Minhas Análises
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-analises', { waitUntil: 'networkidle' }).catch(async () => {
    await page.locator('text=Minhas Análises').first().click();
  });
  await page.waitForTimeout(2500);

  // Localizar o registro 2026.000017/INEMA/RE e clicar em Abrir
  const rowRe = page.locator('tr:has-text("2026.000017/INEMA/RE"), tr:has-text("Emergência")').first();
  console.log('Linha da análise encontrada?', await rowRe.count());

  const btnAbrir = rowRe.locator('a:has-text("Abrir"), button:has-text("Abrir")').first();
  if (await btnAbrir.isVisible().catch(() => false)) {
    await btnAbrir.click();
    await page.waitForTimeout(3000);
  } else {
    await rowRe.click();
    await page.waitForTimeout(2000);
  }

  // Capturar tela da análise aberta com anexo PDF do formulário
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 24 - Analise aberta formulario PDF.png' });
  console.log('✔ Print 24 capturado: Análise aberta com formulário PDF.');
});
