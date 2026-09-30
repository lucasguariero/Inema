const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://gla-inema-hml.acto.com.br/login');
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // 1. Verificar em Meus Processos
  console.log('--- MEUS PROCESSOS ---');
  await page.goto('https://gla-inema-hml.acto.com.br/meus-processos', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rowsMeus = await page.locator('table tbody tr').allInnerTexts().catch(() => []);
  console.log('Total em Meus Processos:', rowsMeus.length);
  for (const r of rowsMeus) {
    console.log('Meus Processos row:', r.replace(/\n+/g, ' | '));
  }

  // 2. Verificar Pauta da Área - cada aba
  console.log('\n--- PAUTA DA ÁREA ---');
  await page.goto('https://gla-inema-hml.acto.com.br/pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const tabs = page.locator('[role="tab"], nav[role="tablist"] button, .fi-tabs-item');
  const countTabs = await tabs.count();
  console.log('Abas encontradas:', countTabs);
  for (let i = 0; i < countTabs; i++) {
    const tabName = (await tabs.nth(i).innerText()).replace(/\n+/g, ' ').trim();
    console.log(`Clicando na aba [${i}]: ${tabName}...`);
    await tabs.nth(i).click();
    await page.waitForTimeout(1500);
    const rows = await page.locator('table tbody tr').count();
    console.log(`Linhas na aba "${tabName}":`, rows);
    if (rows > 0) {
      const texts = await page.locator('table tbody tr').allInnerTexts();
      console.log(`Rows em ${tabName}:\n`, texts.map(t => t.replace(/\n+/g, ' | ')).join('\n'));
    }
  }

  // 3. Buscar pelo número do processo "2026.000009"
  console.log('\n--- BUSCA GLOBAL OU FILTRO POR 2026.000009 ---');
  const searchInput = page.locator('input[placeholder*="Buscar"], input[type="search"]');
  if (await searchInput.count() > 0) {
    await searchInput.first().fill('2026.000009');
    await page.waitForTimeout(2000);
    console.log('Linhas após busca por 2026.000009:', await page.locator('table tbody tr').count());
  }

  // 4. Verificar também Pauta do Coordenador / Gestor
  console.log('\n--- MINHA PAUTA COORDENADOR ---');
  await page.goto('https://gla-inema-hml.acto.com.br/minha-pauta-certidao-debito', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  console.log('Linhas Minha Pauta:', await page.locator('table tbody tr').count());

  await browser.close();
})();
