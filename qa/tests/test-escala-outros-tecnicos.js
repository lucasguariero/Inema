const { chromium } = require('playwright');

async function setFilamentDate(page, inputId, dateIso) {
  await page.evaluate(({ id, val }) => {
    const el = document.getElementById(id);
    const container = el.closest('[x-data]');
    const data = window.Alpine ? window.Alpine.$data(container) : (container._x_dataStack ? container._x_dataStack[0] : null);
    if (data) data.state = val;
  }, { id: inputId, val: dateIso });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  let error500Occurred = false;
  page.on('response', res => {
    if (res.status() === 500) error500Occurred = true;
  });

  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);

  // Ver quais escalas já existem na listagem
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Escalas existentes na tabela:');
  rows.slice(0, 5).forEach((r, i) => console.log(`  [${i}] ${r.replace(/\n/g, ' | ')}`));

  // Testar com outro técnico (ex.: Carlos Eduardo ou outro disponível)
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(800);
  const tecnicos = await page.locator('li[role="option"]').allInnerTexts();
  console.log('\nTécnicos disponíveis no combobox:', tecnicos);

  // Escolher outro técnico que não seja o Bruno
  const outroTecnico = tecnicos.find(t => !t.includes('Bruno') && t.trim().length > 0) || tecnicos[1];
  console.log('Testando duplicidade com:', outroTecnico);

  await page.locator(`li[role="option"]:has-text("${outroTecnico.trim()}")`).first().click();
  await page.waitForTimeout(600);

  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchInput = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput.fill('Salvador');
  await page.waitForTimeout(800);
  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');

  // Criar uma escala para esse técnico em outubro/2026
  await setFilamentDate(page, 'form.espl_data_inicio', '2026-10-01');
  await setFilamentDate(page, 'form.espl_data_fim', '2026-10-15');
  await page.waitForTimeout(800);
  console.log('1. Salvando primeira escala do técnico...');
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  // Agora tentar cadastrar a MESMA escala novamente para esse outro técnico (duplicidade)
  console.log('2. Tentando cadastrar escala conflitante para o mesmo técnico...');
  await page.goto('https://gla-inema-hml.acto.com.br/escalas-plantao/create', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.locator('button#form\\.espl_plan_id').click();
  await page.waitForTimeout(600);
  await page.locator(`li[role="option"]:has-text("${outroTecnico.trim()}")`).first().click();
  await page.waitForTimeout(600);

  await page.locator('button#form\\.municipios').click();
  await page.waitForTimeout(600);
  const searchInput2 = page.locator('input[placeholder="Comece a digitar para pesquisar..."]:visible').first();
  await searchInput2.fill('Salvador');
  await page.waitForTimeout(800);
  await page.locator('li[role="option"]:has-text("Salvador")').first().click();
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape');

  await setFilamentDate(page, 'form.espl_data_inicio', '2026-10-05'); // dentro do intervalo 01 a 15
  await setFilamentDate(page, 'form.espl_data_fim', '2026-10-10');
  await page.waitForTimeout(800);

  error500Occurred = false;
  await page.locator('button:has-text("Criar")').first().click();
  await page.waitForTimeout(3000);

  console.log('\n>>> Resultado do teste com outro técnico:');
  console.log('Disparou erro 500?', error500Occurred);
  const bodyText = await page.locator('body').innerText();
  console.log('Exibiu notificação de erro 500?', bodyText.includes('erro 500'));

  await browser.close();
})();
