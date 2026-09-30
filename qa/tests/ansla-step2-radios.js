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

  // ===== [2.4] Combustível: Queima = Sim =====
  console.log('\n--- [2.4] Combustível ---');
  await page.locator('#form\\.caracterizacao\\.queima_combustivel_secagem-1').click();
  await page.waitForTimeout(2000);
  
  const textAfterQueima = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('[2.4] GLP:', textAfterQueima.includes('GLP'));
  console.log('[2.4] Gás Natural:', textAfterQueima.includes('Gás natural') || textAfterQueima.includes('Gás Natural'));
  console.log('[2.4] Óleo:', textAfterQueima.includes('Óleo'));
  console.log('[2.4] Madeira:', textAfterQueima.includes('Madeira'));
  console.log('[2.4] Lenha (should be ABSENT):', textAfterQueima.includes('Lenha'));
  console.log('[2.4] Outro:', textAfterQueima.includes('Outro'));
  
  await page.screenshot({ path: PRINTS_DIR + '/step2-queima-sim.png' });

  // ===== [2.5] Água: usa_agua = Sim =====
  console.log('\n--- [2.5] Origem da Água ---');
  await page.locator('#form\\.caracterizacao\\.usa_agua-1').click();
  await page.waitForTimeout(2000);
  
  const textAfterAgua = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('[2.5] Captação Chuva/Pluviométrica:', textAfterAgua.includes('Chuva') || textAfterAgua.includes('Pluviométrica') || textAfterAgua.includes('pluviométrica'));
  console.log('[2.5] Concessionária Pública:', textAfterAgua.includes('Concessionária') || textAfterAgua.includes('concessionária'));
  console.log('[2.5] Captação Superficial:', textAfterAgua.includes('Superficial') || textAfterAgua.includes('superficial'));
  console.log('[2.5] Captação Subterrânea:', textAfterAgua.includes('Subterrânea') || textAfterAgua.includes('subterrânea'));
  
  await page.screenshot({ path: PRINTS_DIR + '/step2-agua-sim.png' });

  // ===== [2.6] Efluentes: possui_tratamento = Sim =====
  console.log('\n--- [2.6] Efluentes Líquidos ---');
  await page.locator('#form\\.caracterizacao\\.efluente_possui_tratamento-1').click();
  await page.waitForTimeout(2000);
  
  const textAfterTrat = await page.locator('form[wire\\:submit="save"]').innerText();
  const treatments = ['DAFA', 'Estação de Tratamento', 'Fossa Séptica', 'Sumidouro', 'CSAO', 'Wetland', 'Filtros', 'Outros'];
  console.log('[2.6] Sistemas de tratamento:');
  for (const t of treatments) {
    console.log('  ' + t + ':', textAfterTrat.includes(t));
  }
  
  await page.screenshot({ path: PRINTS_DIR + '/step2-efluentes-sim.png' });

  // ===== [2.7] Emissões: possui_controle = Sim =====
  console.log('\n--- [2.7] Emissões Atmosféricas ---');
  await page.locator('#form\\.caracterizacao\\.emissao_possui_controle-1').click();
  await page.waitForTimeout(2000);
  
  const textAfterEmissao = await page.locator('form[wire\\:submit="save"]').innerText();
  const measures = ['barreira vegetal', 'Pavimentação', 'pavimentação', 'Enclausuramento', 'enclausuramento', 'Monitoramento', 'monitoramento', 'Cobertura', 'cobertura', 'Aspersão', 'aspersão'];
  console.log('[2.7] Medidas de controle:');
  for (const m of measures) {
    if (textAfterEmissao.includes(m)) {
      console.log('  FOUND: ' + m);
    }
  }
  // Print the section around "Medidas" for debugging
  const medIdx = textAfterEmissao.indexOf('medidas de controle');
  const medIdx2 = textAfterEmissao.indexOf('Medidas');
  const startIdx = Math.max(0, Math.min(medIdx, medIdx2) - 50);
  if (medIdx >= 0 || medIdx2 >= 0) {
    console.log('[2.7] Text around medidas:', textAfterEmissao.substring(startIdx, startIdx + 500));
  }
  
  await page.screenshot({ path: PRINTS_DIR + '/step2-emissoes-sim.png' });

  // Print all new visible checkboxes (to see conditional options)
  const allVisCheckboxes = await page.locator('input[type="checkbox"]:visible').all();
  console.log('\n--- All visible checkboxes after Sim clicks ---');
  console.log('Count:', allVisCheckboxes.length);
  for (let i = 0; i < allVisCheckboxes.length; i++) {
    const id = await allVisCheckboxes[i].getAttribute('id');
    const lbl = await allVisCheckboxes[i].evaluate(el => {
      const label = el.closest('label') || (el.parentElement && el.parentElement.closest('label'));
      if (label) return label.textContent.trim();
      const next = el.nextElementSibling;
      if (next) return next.textContent.trim();
      return '';
    });
    console.log(`  CB ${i}: id=${id} label="${lbl.substring(0, 80)}"`);
  }

  console.log('\n=== DONE ===');
  await browser.close();
})();
