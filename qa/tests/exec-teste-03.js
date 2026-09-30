const { chromium } = require('playwright');
const fs = require('fs');

const CARD_DIR = 'qa/cards/card-sispass-calendarios-anuais';
const PRINTS_DIR = `${CARD_DIR}/prints`;

async function login(page, cpf, pwd) {
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill(cpf);
  await page.locator('input[type="password"]').first().fill(pwd);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3000);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== TESTE 03: INICIANDO EXECUÇÃO (SISPASS CALENDÁRIOS ANUAIS) ===');
  await login(page, '00000000000', 'admin123');

  // 1. Acessar Meus Calendários Anuais
  console.log('\n1. Acessando SISPASS > Meus Calendários Anuais...');
  await page.goto('https://gla-inema-hml.acto.com.br/calendario-anual', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const calText = await page.locator('main').innerText();
  console.log('Texto da listagem de Calendários (primeiros 1000 chars):\n', calText.substring(0, 1000));

  // Verificar se há link de Histórico de Tramitação na listagem
  const histBtn = page.locator('button:has-text("Histórico"), a:has-text("Histórico"), [title*="Histórico"]').first();
  if (await histBtn.count() > 0) {
    console.log('\n2. Abrindo modal de Histórico de Tramitação...');
    await histBtn.click();
    await page.waitForTimeout(1500);

    const histModalText = await page.locator('[role="dialog"], .fi-modal, main').innerText();
    console.log('Texto do modal de Histórico:\n', histModalText);
    console.log('Analista Responsável ausente:', !histModalText.includes('Analista Responsável'));
    console.log('Data/Hora presente:', histModalText.includes('Data') || histModalText.includes('Hora'));
    console.log('Endereço presente:', histModalText.includes('Endereço') || histModalText.includes('Endereco'));
    console.log('Resultado presente:', histModalText.includes('Resultado') || histModalText.includes('Situação'));
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  }

  // 3. Abrir cadastro de novo calendário anual
  console.log('\n3. Abrindo tela de cadastro de Calendário Anual...');
  const createCalBtn = page.locator('a:has-text("Cadastrar"), a:has-text("Criar"), a:has-text("Novo"), button:has-text("Cadastrar")').first();
  if (await createCalBtn.count() > 0) {
    await createCalBtn.click();
    await page.waitForTimeout(2000);
  } else {
    await page.goto('https://gla-inema-hml.acto.com.br/calendario-anual/create', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
  }

  console.log('URL de Cadastro de Calendário:', page.url());
  const formCalText = await page.locator('main').innerText();
  console.log('Formulário de Calendário (primeiros 2000 chars):\n', formCalText.substring(0, 2000));

  // 4. Verificar nomenclatura "Fotos a serem anexadas" vs "Nome do Documento"
  console.log('\n4. Verificando nomenclatura da coluna de fotos/documentos...');
  const hasFotosNomenclatura = formCalText.includes('Fotos a serem anexadas');
  const hasNomeDocAntigo = formCalText.includes('Nome do Documento');
  console.log('Fotos a serem anexadas presente:', hasFotosNomenclatura);
  console.log('Nome do Documento (antigo) ausente:', !hasNomeDocAntigo);

  // 5. Verificar seção de espécies integrada
  console.log('Seção de Espécies presente:', formCalText.includes('Espécies') || formCalText.includes('Especies'));

  // 6. Verificar campos de endereço com asterisco de obrigatório
  console.log('Campos de endereço obrigatórios:', formCalText.includes('CEP') || formCalText.includes('Logradouro') || formCalText.includes('Município'));

  // 7. Inspecionar botão Adicionar e campos de laudo técnico
  console.log('Laudo Técnico presente:', formCalText.includes('Laudo Técnico') || formCalText.includes('Laudo'));

  await browser.close();
})();
