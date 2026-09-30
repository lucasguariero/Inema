const { chromium } = require('@playwright/test');

async function testLive() {
  console.log('Testando URL ao vivo em produção...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    const res = await page.goto('https://inema.acto.com.br/?rota=relatorios', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Status HTTP:', res.status());
    await page.waitForTimeout(2000);
    const title = await page.title();
    console.log('Page Title:', title);
    const hasHeader = await page.locator('h1:has-text("Relatórios de Regulação")').count();
    console.log('Encontrou H1 Relatórios de Regulação:', hasHeader > 0 ? 'SIM' : 'NÃO');
    if (hasHeader > 0) {
      await page.screenshot({ path: 'prints_regulacao/08_live_production.png' });
      console.log('Screenshot de produção capturado!');
    }
  } catch (e) {
    console.error('Erro ao acessar produção:', e.message);
  } finally {
    await browser.close();
  }
}

testLive();
