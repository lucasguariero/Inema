const { chromium } = require('playwright');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';
fs.mkdirSync(PRINTS_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Step 1 fill
  await page.locator('select[id="form.ansa_tipo_responsavel"]').selectOption({ label: 'O Próprio Requerente' });
  await page.waitForTimeout(1500);
  await page.locator('button#form\\.ansa_tati_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("SILOS E ARMAZÉNS")').click();
  await page.waitForTimeout(2000);
  await page.locator('button#form\\.ansa_empr_id').click();
  await page.waitForTimeout(1000);
  await page.locator('li[role="option"]:has-text("Fazenda Demo ANSLA")').click();
  await page.waitForTimeout(1500);
  const visibleCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of visibleCbs) {
    if (!(await cb.isChecked())) await cb.check({ force: true });
    await page.waitForTimeout(200);
  }
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);
  console.log('On Step 2.');

  // Inspect all radio buttons and their IDs/names
  const radios = await page.locator('input[type="radio"]:visible').all();
  console.log('Visible radios count:', radios.length);
  for (let i = 0; i < radios.length; i++) {
    const id = await radios[i].getAttribute('id');
    const name = await radios[i].getAttribute('name');
    const value = await radios[i].getAttribute('value');
    const label = await radios[i].evaluate(el => {
      const lbl = el.closest('label') || el.parentElement;
      return lbl ? lbl.textContent.trim() : '';
    });
    console.log(`Radio ${i}: id=${id} name=${name} value=${value} label="${label.substring(0, 60)}"`);
  }

  await browser.close();
})();
