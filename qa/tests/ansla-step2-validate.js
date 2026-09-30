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

  // Step 1
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

  // Check all visible checkboxes
  const visibleCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of visibleCbs) {
    if (!(await cb.isChecked())) await cb.check({ force: true });
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);
  console.log('On Step 2 now.');

  // ========== STEP 2 VALIDATIONS ==========
  
  // [2.3] Problema 1: "Armazém de insumos" not "Aerização de insumos"
  const pageText = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('\n[2.3] "Armazém de insumos" present:', pageText.includes('Armazém de insumos'));
  console.log('[2.3] "Aerização de insumos" absent:', !pageText.includes('Aerização de insumos'));

  // [2.4] COMBUSTÍVEL: Click "Sim" for queima
  console.log('\n--- [2.4] Combustível ---');
  const queimaRadios = page.locator('text=No empreendimento é realizada a queima de combustíveis para secagem?').locator('..').locator('..').locator('input[type="radio"]');
  // Try a different approach - find the label then the radio
  const queimaSection = page.locator(':text("No empreendimento é realizada a queima de combustíveis para secagem?")').first();
  // Click "Sim" next to queima question
  const allRadioLabels = await page.getByText('Sim', { exact: true }).all();
  console.log('All "Sim" text elements:', allRadioLabels.length);

  // Approach: use evaluate to find and click the queima "Sim" radio
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const queimaLabel = labels.find(l => l.textContent.includes('queima de combustíveis para secagem'));
    if (queimaLabel) {
      const container = queimaLabel.closest('.fi-fo-field-wrp') || queimaLabel.parentElement.parentElement;
      const simRadio = container.querySelector('input[type="radio"][value="1"], input[type="radio"]');
      if (simRadio) simRadio.click();
    }
  });
  await page.waitForTimeout(1500);

  // Check combustível options
  const combustivelText = await page.locator('form[wire\\:submit="save"]').innerText();
  const hasGLP = combustivelText.includes('GLP');
  const hasGasNatural = combustivelText.includes('Gás Natural') || combustivelText.includes('Gás natural');
  const hasOleo = combustivelText.includes('Óleo');
  const hasMadeira = combustivelText.includes('Madeira');
  const hasLenha = combustivelText.includes('Lenha');
  const hasOutro = combustivelText.includes('Outro');
  console.log('[2.4] GLP:', hasGLP);
  console.log('[2.4] Gás Natural:', hasGasNatural);
  console.log('[2.4] Óleo:', hasOleo);
  console.log('[2.4] Madeira:', hasMadeira);
  console.log('[2.4] Lenha (should be ABSENT):', hasLenha);
  console.log('[2.4] Outro:', hasOutro);
  console.log('[2.4] Combustível list CORRECT:', hasGLP && hasOleo && hasMadeira && !hasLenha);

  await page.screenshot({ path: PRINTS_DIR + '/step2-combustivel-sim.png' });

  // [2.5] ÁGUA: Click "Sim" for utiliza água
  console.log('\n--- [2.5] Origem da Água ---');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, p, legend'));
    const aguaLabel = labels.find(l => l.textContent.includes('A atividade utiliza ou vai utilizar água?'));
    if (aguaLabel) {
      const container = aguaLabel.closest('.fi-fo-field-wrp') || aguaLabel.parentElement.parentElement;
      const simRadio = container.querySelector('input[type="radio"][value="1"], input[type="radio"]');
      if (simRadio) { simRadio.click(); console.log('Clicked Sim for água'); }
    }
  });
  await page.waitForTimeout(2000);

  const aguaText = await page.locator('form[wire\\:submit="save"]').innerText();
  const hasChuva = aguaText.includes('Captação de Água de Chuva') || aguaText.includes('Pluviométrica') || aguaText.includes('chuva');
  const hasConcessionaria = aguaText.includes('Concessionária') || aguaText.includes('concessionária');
  console.log('[2.5] Captação de Água de Chuva/Pluviométrica:', hasChuva);
  console.log('[2.5] Concessionária Pública:', hasConcessionaria);

  await page.screenshot({ path: PRINTS_DIR + '/step2-agua-sim.png' });

  // [2.6] EFLUENTES: Click "Sim" for possui sistema de tratamento
  console.log('\n--- [2.6] Efluentes Líquidos ---');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, p, legend'));
    const eflLabel = labels.find(l => l.textContent.includes('Possui sistema de tratamento?'));
    if (eflLabel) {
      const container = eflLabel.closest('.fi-fo-field-wrp') || eflLabel.parentElement.parentElement;
      const simRadio = container.querySelector('input[type="radio"][value="1"], input[type="radio"]');
      if (simRadio) { simRadio.click(); console.log('Clicked Sim for sistema de tratamento'); }
    }
  });
  await page.waitForTimeout(2000);

  const eflText = await page.locator('form[wire\\:submit="save"]').innerText();
  const treatments = ['DAFA', 'ETE', 'Fossa', 'Sumidouro', 'CSAO', 'Wetland', 'Filtros'];
  console.log('[2.6] Sistemas de tratamento renderizados:');
  for (const t of treatments) {
    console.log('  ' + t + ':', eflText.includes(t));
  }

  await page.screenshot({ path: PRINTS_DIR + '/step2-efluentes-sim.png' });

  // [2.7] EMISSÕES: Click "Sim" for medidas de controle
  console.log('\n--- [2.7] Emissões Atmosféricas ---');
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, span, p, legend'));
    const emLabel = labels.find(l => l.textContent.includes('Possui medidas de controle de emissões?'));
    if (emLabel) {
      const container = emLabel.closest('.fi-fo-field-wrp') || emLabel.parentElement.parentElement;
      const simRadio = container.querySelector('input[type="radio"][value="1"], input[type="radio"]');
      if (simRadio) { simRadio.click(); console.log('Clicked Sim for medidas de controle'); }
    }
  });
  await page.waitForTimeout(2000);

  const emText = await page.locator('form[wire\\:submit="save"]').innerText();
  const measures = ['barreira vegetal', 'Pavimentação', 'Enclausuramento', 'Monitoramento', 'Cobertura', 'Aspersão', 'Outros'];
  console.log('[2.7] Medidas de controle renderizadas:');
  for (const m of measures) {
    console.log('  ' + m + ':', emText.toLowerCase().includes(m.toLowerCase()));
  }

  await page.screenshot({ path: PRINTS_DIR + '/step2-emissoes-sim.png' });

  console.log('\n=== DONE ===');
  await browser.close();
})();
