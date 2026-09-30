const { chromium } = require('playwright');
const { attachNetworkLogger } = require('../utils/qa-helper');
const fs = require('fs');

const PRINTS_DIR = 'qa/cards/card-05-silos-armazens/prints';
fs.mkdirSync(PRINTS_DIR, { recursive: true });

async function login(page, cpf, pwd) {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill(cpf);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const logger = attachNetworkLogger(page);

  await login(page, '00000000000', 'admin123');
  console.log('Logged in.');

  // ===== BLOCO 1: NOMENCLATURA =====
  console.log('\n========== BLOCO 1: Nomenclatura ==========');
  
  // [1.1] Menu lateral
  const sidebarText = await page.locator('aside, nav').allInnerTexts();
  const fullSidebar = sidebarText.join(' ');
  const menuOk = fullSidebar.includes('Atividades Não Sujeitas a Licenciamento Ambiental');
  console.log('[1.1] Menu lateral OK:', menuOk);

  // [1.1] Page title
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/informacoes', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const infoTitle = await page.title();
  console.log('[1.1] Title informacoes:', infoTitle);
  console.log('[1.1] Title OK:', infoTitle.includes('Atividades Não Sujeitas a Licenciamento Ambiental'));
  await page.screenshot({ path: PRINTS_DIR + '/01-menu-e-titulo.png' });

  // [1.2] Cadastro header
  await page.goto('https://gla-inema-hml.acto.com.br/atividades-dispensadas/cadastrar?tati_id=8', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const cadastroTitle = await page.title();
  console.log('[1.2] Cadastro title:', cadastroTitle);
  console.log('[1.2] Cadastro header OK:', cadastroTitle.includes('Cadastrar Atividade Não Sujeita a Licenciamento Ambiental'));

  // ===== STEP 1: DADOS BÁSICOS =====
  console.log('\n========== STEP 1: Dados Básicos ==========');
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

  // [1.4] Declarações
  const visibleCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of visibleCbs) {
    if (!(await cb.isChecked())) await cb.check({ force: true });
    await page.waitForTimeout(200);
  }
  
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);
  console.log('[1.4] Avançou para Step 2.');

  // ===== STEP 2: CARACTERIZAÇÃO =====
  console.log('\n========== STEP 2: Caracterização ==========');
  
  // [2.3] Operações
  const formText = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('[2.3] Armazém de insumos:', formText.includes('Armazém de insumos'));
  console.log('[2.3] Aerização ausente:', !formText.includes('Aerização'));
  console.log('[2.2] CNAE "Selecione ao menos um CNAE":', formText.includes('Selecione ao menos um CNAE'));

  // [2.1] Comunidade = Não
  await page.locator('#form\\.caracterizacao\\.comunidade_raio_1km-0').click();
  await page.waitForTimeout(500);

  // Área construída e terreno
  await page.locator('input[type="number"]').first().fill('500');
  await page.waitForTimeout(300);
  await page.locator('input[type="number"]').nth(1).fill('10000');
  await page.waitForTimeout(300);

  // [2.3] Operações: marcar algumas
  const opCheckboxes = await page.locator('input[type="checkbox"]:visible').all();
  // Mark: Armazenagem (CB 6), Armazém de insumos (CB 8)
  for (let i = 0; i < Math.min(10, opCheckboxes.length); i++) {
    const lbl = await opCheckboxes[i].evaluate(el => {
      const l = el.closest('label') || el.parentElement;
      return l ? l.textContent.trim() : '';
    });
    if (lbl.includes('Armazenagem') || lbl.includes('Armazém de insumos') || lbl.includes('Recebimento')) {
      await opCheckboxes[i].check({ force: true });
      console.log('  Checked:', lbl);
      await page.waitForTimeout(200);
    }
  }

  // [2.4] Queima = Sim
  await page.locator('#form\\.caracterizacao\\.queima_combustivel_secagem-1').click();
  await page.waitForTimeout(1500);
  // Select Madeira to test RAF fields
  const madeiraCb = page.locator('label:has-text("Madeira") input[type="checkbox"], input[type="checkbox"] + span:has-text("Madeira")').first();
  // Try to find and check Madeira
  const allCbsNow = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of allCbsNow) {
    const lbl = await cb.evaluate(el => {
      const l = el.closest('label') || el.parentElement;
      return l ? l.textContent.trim() : '';
    });
    if (lbl === 'Madeira') {
      await cb.check({ force: true });
      console.log('[2.4] Checked Madeira');
      await page.waitForTimeout(1000);
      break;
    }
    if (lbl === 'GLP') {
      await cb.check({ force: true });
      console.log('[2.4] Checked GLP');
      await page.waitForTimeout(300);
    }
  }

  // Check if RAF fields appeared
  const rafText = await page.locator('form[wire\\:submit="save"]').innerText();
  const hasRAF = rafText.includes('RAF') || rafText.includes('Certificado');
  console.log('[2.4] Certificado RAF visible após Madeira:', hasRAF);
  
  await page.screenshot({ path: PRINTS_DIR + '/02-operacoes-combustivel.png' });

  // Caldeira = Não
  await page.locator('#form\\.caracterizacao\\.utiliza_caldeira-0').click();
  await page.waitForTimeout(500);

  // [2.5] Água = Sim
  await page.locator('#form\\.caracterizacao\\.usa_agua-1').click();
  await page.waitForTimeout(1500);
  
  // Check Captação Chuva checkbox
  const aguaCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of aguaCbs) {
    const lbl = await cb.evaluate(el => {
      const l = el.closest('label') || el.parentElement;
      return l ? l.textContent.trim() : '';
    });
    if (lbl.includes('Chuva') || lbl.includes('Pluviométrica')) {
      await cb.check({ force: true });
      console.log('[2.5] Checked:', lbl);
      await page.waitForTimeout(300);
    }
    if (lbl.includes('Concessionária') || lbl.includes('Rede Pública')) {
      await cb.check({ force: true });
      console.log('[2.5] Checked:', lbl);
      await page.waitForTimeout(1000);
      // Check for Embasa/SAAE
      const concText = await page.locator('form[wire\\:submit="save"]').innerText();
      console.log('[2.5] Embasa:', concText.includes('Embasa') || concText.includes('EMBASA'));
      console.log('[2.5] SAAE:', concText.includes('SAAE'));
    }
  }

  await page.screenshot({ path: PRINTS_DIR + '/03-agua-efluentes.png' });

  // [2.6] Efluentes = Sim
  await page.locator('#form\\.caracterizacao\\.efluente_possui_tratamento-1').click();
  await page.waitForTimeout(1500);
  // Corpo hídrico = Não
  await page.locator('#form\\.caracterizacao\\.lanca_efluente_corpo_hidrico-0').click();
  await page.waitForTimeout(500);

  // Mark some treatment checkboxes
  const treatCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of treatCbs) {
    const lbl = await cb.evaluate(el => {
      const l = el.closest('label') || el.parentElement;
      return l ? l.textContent.trim() : '';
    });
    if (lbl.includes('Fossa') || lbl.includes('DAFA')) {
      await cb.check({ force: true });
      console.log('[2.6] Checked:', lbl.substring(0, 40));
      await page.waitForTimeout(200);
    }
  }

  // [2.7] Emissões = Sim
  await page.locator('#form\\.caracterizacao\\.emissao_possui_controle-1').click();
  await page.waitForTimeout(1500);

  // Mark emission checkboxes
  const emCbs = await page.locator('input[type="checkbox"]:visible').all();
  for (const cb of emCbs) {
    const lbl = await cb.evaluate(el => {
      const l = el.closest('label') || el.parentElement;
      return l ? l.textContent.trim() : '';
    });
    if (lbl.includes('Gases de combustão') || lbl.includes('barreira vegetal')) {
      await cb.check({ force: true });
      console.log('[2.7] Checked:', lbl.substring(0, 50));
      await page.waitForTimeout(200);
    }
    // Equipamentos de controle
    if (lbl.includes('Ciclones') || lbl.includes('Câmara')) {
      await cb.check({ force: true });
      await page.waitForTimeout(200);
    }
    // Resíduos
    if (lbl.includes('Classe II A')) {
      await cb.check({ force: true });
      await page.waitForTimeout(200);
    }
    if (lbl.includes('Reciclagem') || lbl.includes('Aterro')) {
      await cb.check({ force: true });
      await page.waitForTimeout(200);
    }
    // Segurança
    if (lbl.includes('combate a incêndio') || lbl.includes('ventilação')) {
      await cb.check({ force: true });
      await page.waitForTimeout(200);
    }
  }

  await page.screenshot({ path: PRINTS_DIR + '/04-emissoes-residuos.png' });

  console.log('\n========== Saving (Próximo to Step 3 or Save) ==========');
  // Try clicking Próximo to go to step 3
  await page.getByRole('button', { name: 'Próximo' }).click();
  await page.waitForTimeout(3000);
  
  const afterNext = await page.locator('form[wire\\:submit="save"]').innerText();
  console.log('After Próximo (first 500):', afterNext.substring(0, 500));
  
  await page.screenshot({ path: PRINTS_DIR + '/05-step3-docs.png' });

  // Network errors
  if (logger.errors && logger.errors.length > 0) {
    console.log('\nNetwork errors:', JSON.stringify(logger.errors, null, 2));
  } else {
    console.log('\nNo network errors.');
  }

  console.log('\n=== TEST COMPLETE ===');
  await browser.close();
})();
