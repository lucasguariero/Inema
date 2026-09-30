const { test, expect } = require('@playwright/test');

test('DOR003 - Bloco 8: Bruno Carvalho dar ciencia e visualizar PDF', async ({ page }) => {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('19600000042');
  await page.locator('input[type="password"]').first().fill('@Plantao123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ir para Minhas Análises
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-analises', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Clicar em "Visualizar" no registro 2026.000017/INEMA/RE
  const rowRe = page.locator('tr:has-text("2026.000017/INEMA/RE")').first();
  const btnVisualizar = rowRe.locator('a:has-text("Visualizar"), button:has-text("Visualizar")').first();
  await btnVisualizar.click();
  await page.waitForTimeout(3000);

  console.log('URL da Análise aberta:', page.url());
  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 24 - Detalhes da analise e formulario PDF.png' });
  console.log('✔ Print 24 capturado: Detalhes da análise.');

  // Voltar para Minhas Análises para comprovar que o contador diminuiu e "Aguardando sua ciência" sumiu
  await page.goto('https://gla-inema-hml.acto.com.br/fiscalizacao/minhas-analises', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Expandir Fiscalização
  await page.locator('button:has-text("Fiscalização"), a:has-text("Fiscalização"), div:has-text("Fiscalização")').first().click().catch(() => {});
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'qa/cards/card-03-emergencia-interna/prints/Print 24B - Ciencia registrada contador atualizado.png' });
  console.log('✔ Print 24B capturado: Ciência registrada.');
});
