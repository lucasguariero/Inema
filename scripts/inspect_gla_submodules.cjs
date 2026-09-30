const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const TARGET_URLS = [
  // Cadastros Mestres do Cidadão / Empreendedor
  { id: 'responsaveis-tecnicos', url: 'https://gla-inema-hml.acto.com.br/responsaveis-tecnicos', category: 'Cadastros Básicos' },
  { id: 'representantes-legais', url: 'https://gla-inema-hml.acto.com.br/representantes-legais', category: 'Cadastros Básicos' },
  { id: 'empreendimentos', url: 'https://gla-inema-hml.acto.com.br/empreendimentos', category: 'Cadastros Básicos' },
  { id: 'propriedades-rurais', url: 'https://gla-inema-hml.acto.com.br/propriedade-rurals', category: 'Cadastros Básicos' },
  { id: 'procuradores', url: 'https://gla-inema-hml.acto.com.br/procuradores', category: 'Cadastros Básicos' },
  
  // Parametrizações & Configurações
  { id: 'tipologias', url: 'https://gla-inema-hml.acto.com.br/administracao/tipologia?sub=tipologias', category: 'Parametrização' },
  { id: 'residuos', url: 'https://gla-inema-hml.acto.com.br/residuos', category: 'Parametrização' },
  { id: 'produtos-perigosos', url: 'https://gla-inema-hml.acto.com.br/produtos-perigosos/produto-perigosos', category: 'Parametrização' },
  { id: 'setores', url: 'https://gla-inema-hml.acto.com.br/setores/setors', category: 'Parametrização' },
  { id: 'orgaos-ambientais', url: 'https://gla-inema-hml.acto.com.br/orgaos-ambientais/orgao-ambientals', category: 'Parametrização' },
  { id: 'legislacoes', url: 'https://gla-inema-hml.acto.com.br/legislacoes', category: 'Parametrização' },
  { id: 'tipos-documento', url: 'https://gla-inema-hml.acto.com.br/tipos-documento', category: 'Parametrização' },
  { id: 'parametrizacao-informativos', url: 'https://gla-inema-hml.acto.com.br/parametrizacao-informativos', category: 'Parametrização' },
  { id: 'configuracao-juros-mora', url: 'https://gla-inema-hml.acto.com.br/configuracao-juros-mora', category: 'Parametrização' },
  { id: 'instrumento-confissao', url: 'https://gla-inema-hml.acto.com.br/configuracao-instrumento-confissao', category: 'Parametrização' },
  { id: 'usuarios', url: 'https://gla-inema-hml.acto.com.br/users', category: 'Administração & Acesso' },
  { id: 'grupos-perfis', url: 'https://gla-inema-hml.acto.com.br/roles', category: 'Administração & Acesso' },
  { id: 'atos-ambientais', url: 'https://gla-inema-hml.acto.com.br/portal/ato-ambiental/ato-ambientals', category: 'Administração & Acesso' },
  { id: 'auditorias', url: 'https://gla-inema-hml.acto.com.br/auditorias', category: 'Gestão e Controle' },

  // Fauna / CRAS Submódulos
  { id: 'cras-admissao', url: 'https://gla-inema-hml.acto.com.br/cras/admissao-animais/admissao-animals', category: 'Gestão de Fauna' },
  { id: 'cras-manejo', url: 'https://gla-inema-hml.acto.com.br/cras/manejo-animais/manejo-animals', category: 'Gestão de Fauna' },
  { id: 'cras-especies', url: 'https://gla-inema-hml.acto.com.br/cras/especie-animais/especie-animals', category: 'Gestão de Fauna' },
  { id: 'cras-destinacoes', url: 'https://gla-inema-hml.acto.com.br/cras/destinacao-animais/destinacao-animals', category: 'Gestão de Fauna' },
  { id: 'cras-recintos', url: 'https://gla-inema-hml.acto.com.br/cras/recintos', category: 'Gestão de Fauna' },
  { id: 'cras-marcacoes', url: 'https://gla-inema-hml.acto.com.br/cras/marcacao-animais/marcacao-animals', category: 'Gestão de Fauna' },

  // Enquadramento & Pautas Técnicas
  { id: 'pauta-enquadramento', url: 'https://gla-inema-hml.acto.com.br/pauta-area-enquadramento', category: 'Regulação Ambiental' },
  { id: 'desbloqueios-ape', url: 'https://gla-inema-hml.acto.com.br/desbloqueios-ape', category: 'Regulação Ambiental' },
  { id: 'validar-documentos-perfis', url: 'https://gla-inema-hml.acto.com.br/validar-documentos', category: 'Serviços' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Logando no GLA...');
  await page.goto('https://gla-inema-hml.acto.com.br/login', { waitUntil: 'networkidle' });
  await page.locator('input[type="text"]').first().fill('00000000000');
  await page.locator('input[type="password"]').first().fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(3500);

  const inspectedData = [];

  for (const item of TARGET_URLS) {
    console.log(`Inspecionando: [${item.category}] ${item.id} -> ${item.url}`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);

      const info = await page.evaluate((target) => {
        const title = document.querySelector('h1, .fi-header-heading')?.innerText?.trim() || '';
        const actions = Array.from(document.querySelectorAll('.fi-header-actions button, .fi-header-actions a, header button')).map(b => b.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
        const columns = Array.from(document.querySelectorAll('table thead th')).map(th => th.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
        const tabs = Array.from(document.querySelectorAll('.fi-tabs button, .fi-tabs a, [role="tab"]')).map(t => t.innerText.trim().replace(/\n+/g, ' '));
        const filters = Array.from(document.querySelectorAll('.fi-ta-filter, [wire\\:model*="filter"] select, input[placeholder*="Filtrar"], input[placeholder*="Buscar"]')).map(f => f.getAttribute('placeholder') || f.getAttribute('name') || 'Filtro');
        
        return {
          id: target.id,
          category: target.category,
          title,
          url: target.url,
          actions,
          columns,
          tabs,
          filters
        };
      }, item);

      // Tentar clicar no botão de criar "+ Novo" ou "Cadastrar" para inspecionar campos do modal ou formulário se houver
      const createBtn = page.locator('.fi-header-actions button:has-text("Novo"), .fi-header-actions button:has-text("Cadastrar"), .fi-header-actions a:has-text("Novo"), .fi-header-actions a:has-text("Cadastrar"), button:has-text("Adicionar")').first();
      let formFields = [];
      let modalTitle = null;

      if (await createBtn.count() > 0) {
        try {
          await createBtn.click({ timeout: 2000 });
          await page.waitForTimeout(1000);
          
          const modalData = await page.evaluate(() => {
            const modalHeading = document.querySelector('.fi-modal-heading, .fi-fo-field-wrp-label, h2, h3')?.innerText?.trim() || '';
            const labels = Array.from(document.querySelectorAll('.fi-modal label, .fi-form label, form label, .fi-fo-field-wrp-label')).map(l => l.innerText.trim().replace(/\n+/g, ' ')).filter(Boolean);
            const inputs = Array.from(document.querySelectorAll('.fi-modal input, .fi-modal select, .fi-modal textarea, form input, form select, form textarea')).map(i => i.getAttribute('placeholder') || i.getAttribute('name') || i.tagName);
            return { modalHeading, labels, inputs };
          });

          modalTitle = modalData.modalHeading;
          formFields = modalData.labels.slice(0, 25);
        } catch (e) {
          // Ignorar se não abriu modal
        }
      }

      inspectedData.push({
        ...info,
        modalTitle,
        formFields
      });

    } catch (err) {
      console.error(`Erro ao inspecionar ${item.id}:`, err.message);
      inspectedData.push({
        id: item.id,
        category: item.category,
        url: item.url,
        error: err.message
      });
    }
  }

  const outPath = path.resolve(__dirname, '../qa/gla_submodules_detailed_inspection.json');
  fs.writeFileSync(outPath, JSON.stringify(inspectedData, null, 2));
  console.log(`\nInspeção detalhada salva com sucesso em: ${outPath}`);

  await browser.close();
}

main().catch(console.error);
