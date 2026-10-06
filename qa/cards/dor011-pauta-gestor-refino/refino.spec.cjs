const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const url = 'http://127.0.0.1:3000/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';
const prints = path.join(__dirname, 'prints');
fs.mkdirSync(prints, { recursive: true });
const select = async (page, label, option) => { await page.getByRole('button', { name: label, exact: true }).click(); await page.getByRole('option', { name: option, exact: true }).click(); };
const open = async (page, action) => { await page.getByRole('button', { name: /^Ações de/ }).first().click(); await page.getByRole('button', { name: action, exact: true }).click(); };
const shot = (page, name) => page.screenshot({ path: path.join(prints, name + '.png'), animations: 'disabled' });
test.beforeEach(async ({ page }) => { await page.goto(url); await expect(page.getByRole('heading', { name: 'Pauta do Gestor - Registros', exact: true })).toBeVisible(); });
let domain;
test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage(); await page.goto(url);
  domain = await page.evaluate(async () => {
    const d = await import('/src/lib/pautaGestor.ts'), m = await import('/src/data/pautaGestorMock.ts'), c = await import('/src/lib/pautaColunas.ts');
    const rows = m.criarRegistrosPauta(), s = d.SESSAO_SIMULADA, f = d.FILTROS_VAZIOS;
    const command = (action, data = rows) => ({ acao: action, id: data[0].id, versao: data[0].versao, versoes: Object.fromEntries(data.map(r => [r.id, r.versao])) });
    const denied = fn => { try { fn(); return false; } catch { return true; } };
    const query = (filters = {}, session = s, tab = 'Todos') => d.consultarPauta(rows, tab, { ...f, ...filters }, session);
    const snapshot = JSON.stringify(rows);
    const attached = d.executarComando(rows, { ...command('anexar'), destino: rows[3].id }, s).registros;
    const detached = d.executarComando(attached, { ...command('desanexar', attached), justificativa: 'Eventos distintos comprovados.' }, s).registros;
    const comment = d.executarComando(rows, { ...command('comentario'), comentario: 'Observação técnica.' }, s).registros[0];
    const closed = { dados: false, localizacao: false, periodo: false, classificacao: false };
    return {
      'escopo DIFIS': query().length === 13 && query().every(r => r.escopo === 'DIFIS'),
      'escopo OUTRO': query({}, { ...s, escopo: 'OUTRO', perfil: 'Gestor OUTRO', destinos: ['OUTRO'] }).length === 3,
      'sem autorização': query({}, { ...s, autenticado: false }).length === 0 && query({}, { ...s, interno: false }).length === 0,
      'candidato negado': !d.duplicidades(rows[0], rows, undefined, { ...s, itensAutorizados: [rows[0].id] }).length && !d.itemAutorizado({ ...s, itensAutorizados: [rows[0].id] }, rows[3]),
      'dados pessoais protegidos': !query({ demandante: rows[0].demandante }, { ...s, verDemandante: false }).length,
      'matriz sem default': !d.podeExecutar({ ...s, regrasAcoes: {} }, rows[0], 'arquivar') && !d.podeExecutar({ ...s, permissoes: ['visualizar'] }, rows[0], 'arquivar'),
      'matriz tipo status relação': !d.podeExecutar(s, { ...rows[0], tipo: 'OF' }, 'arquivar') && !d.podeExecutar(s, { ...rows[0], status: 'Arquivado' }, 'arquivar') && !d.podeExecutar({ ...s, regrasAcoes: { arquivar: { ...s.regrasAcoes.arquivar, relacionamento: 'sem-relacao' } } }, attached[0], 'arquivar'),
      'integrações sem operação fictícia': ['pdf', 'geo', 'processo', 'oficio', 'converter'].every(a => !d.podeExecutar(s, rows[0], a) && denied(() => d.executarComando(rows, command(a), s))),
      'colunas por contexto': !c.colunasAplicaveis('RE', s).includes('eixo') && !c.colunasAplicaveis('RT', s).includes('demandante') && !c.colunasAplicaveis('OF', s).includes('eixo') && !c.colunasAplicaveis('Todos', { ...s, verDemandante: false }).includes('demandante'),
      'duplicados condicionais': !c.colunasObrigatorias([{ ...rows[4], municipio: 'isolado', cep: '', endereco: '', bairro: '', coordenada: undefined }], [], s).includes('duplicados') && c.colunasObrigatorias([rows[0]], rows, s).includes('duplicados'),
      'documentos geo': d.referenciasEspaciais(rows[0]).some(r => r.fonte.startsWith('RAE')) && d.referenciasEspaciais(rows[0]).some(r => r.fonte.startsWith('RFA')) && rows[2].documentos.map(r => r.tipo).join() === 'Nota Técnica,PTAD',
      'limites SLA exatos': [0,89,90,149,150,180,181,190].map(m.nivelSla).join() === 'gray,gray,warning,warning,orange,orange,danger,danger',
      'AND palavras inteiras sem acento': query({ palavra: 'residuos sólidos', municipio: 'Salvador' }).length === 3 && query({ palavra: 'resid' }).length === 0,
      'número completo exato': query({ numero: rows[0].numero }).length === 1 && query({ numero: '000101' }).length === 0,
      'grupos recolhidos excluídos': !d.filtrosDaConsulta({ ...f, palavra: 'inexistente', municipio: 'Salvador' }, closed).palavra && !d.filtrosDaConsulta({ ...f, municipio: 'Salvador' }, closed).municipio,
      'inaplicáveis após troca': !d.limparInaplicaveis({ ...f, eixo: 'Indústria', subitem: 'Efluentes', uc: 'x', emergencia: 'Outros' }, 'OF').eixo && !d.limparInaplicaveis({ ...f, emergencia: 'Outros' }, 'RD').emergencia,
      'datas e coordenada inválidas': !!d.validarFiltros({ ...f, inicial: '2026-10-05' }) && !!d.validarFiltros({ ...f, inicial: '2026-10-05', final: '2026-10-04' }) && !!d.validarFiltros({ ...f, coordenada: '91,0' }),
      'referência antiga e histórico': attached[0].pai === rows[3].id && attached[0].historico.length === 2 && attached[3].historico.length === 2,
      'desanexação justificada': !detached[0].pai && !detached[3].pai && detached[0].status === 'Em Análise Técnica' && denied(() => d.executarComando(attached, command('desanexar', attached), s)),
      'falha concorrente sem parcial': denied(() => d.executarComando(rows, { ...command('anexar'), destino: rows[3].id, versoes: { ...command('anexar').versoes, [rows[3].id]: 0 } }, s)) && JSON.stringify(rows) === snapshot,
      'duplo envio rejeitado': denied(() => d.executarComando(attached, { ...command('anexar'), destino: rows[3].id }, s)) && JSON.stringify(rows) === snapshot,
      'arquivo permitido proibido vazio': d.EXTENSOES_ARQUIVOS.length === 19 && d.EXTENSOES_ARQUIVOS.every(e => d.arquivoPermitido('arquivo.' + e)) && !d.arquivoPermitido('a.exe') && d.executarComando(rows, { ...command('arquivos'), arquivos: [{ nome: 'vazio.txt', tamanho: 0 }] }, s).registros[0].arquivos.length === rows[0].arquivos.length + 1,
      'falha upload integral': denied(() => d.executarComando(rows, { ...command('arquivos'), arquivos: [{ nome: 'a.txt', tamanho: 1 }, { nome: 'b.exe', tamanho: 1 }] }, s)) && JSON.stringify(rows) === snapshot,
      'comentário sem efeito operacional': comment.status === rows[0].status && comment.responsavel === rows[0].responsavel && comment.data === rows[0].data,
      'encaminhamento autorizado': denied(() => d.executarComando(rows, { ...command('encaminhar'), destino: 'DESTINO INEXISTENTE' }, s)) && d.executarComando(rows, { ...command('encaminhar'), destino: 'UR Metropolitana' }, s).registros[0].historico.at(-1).novo.includes('UR Metropolitana'),
      'eixo e arquivamento validam': denied(() => d.executarComando(rows, { ...command('eixo'), eixo: 'Indústria', subitem: 'inexistente' }, s)) && denied(() => d.executarComando(rows, { ...command('arquivar'), motivo: 'Outros', justificativa: 'Justificado' }, s)),
    };
  }); await page.close();
});
for (const name of ['escopo DIFIS','escopo OUTRO','sem autorização','candidato negado','dados pessoais protegidos','matriz sem default','matriz tipo status relação','integrações sem operação fictícia','colunas por contexto','duplicados condicionais','documentos geo','limites SLA exatos','AND palavras inteiras sem acento','número completo exato','grupos recolhidos excluídos','inaplicáveis após troca','datas e coordenada inválidas','referência antiga e histórico','desanexação justificada','falha concorrente sem parcial','duplo envio rejeitado','arquivo permitido proibido vazio','falha upload integral','comentário sem efeito operacional','encaminhamento autorizado','eixo e arquivamento validam']) test('Regra independente: ' + name, () => expect(domain[name], name).toBe(true));
test('Municípios oficiais: 417 códigos únicos e busca com/sem acento', async ({ page }) => {
  const cat = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../src/data/municipiosBahia.json'), 'utf8'));
  expect(cat.municipios).toHaveLength(417); expect(new Set(cat.municipios.map(m => m.codigoIbge)).size).toBe(417);
  expect(cat.municipios[0].nome).toBe('Abaíra'); expect(cat.municipios[416].nome).toBe('Xique-Xique');
  await page.getByRole('button', { name: 'Expandir Localização' }).click();
  for (const [text, expected] of [['Abaira', 'Abaíra'], ['Abaíra', 'Abaíra'], ['Jaguaquara', 'Jaguaquara'], ['Xique', 'Xique-Xique']]) {
    await page.getByRole('button', { name: 'Município', exact: true }).click();
    await page.getByRole('combobox', { name: 'Pesquisar opções' }).fill(text);
    await expect(page.getByRole('option', { name: expected, exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('button', { name: 'Município', exact: true }).click(); await page.getByRole('combobox').fill('Município inexistente'); await expect(page.getByText('Nenhum resultado encontrado.')).toBeVisible();
  await shot(page, 'Print 02 - Busca municipal sem resultado');
});
test('TL005: abrir candidato e voltar preserva seleção e contexto', async ({ page }) => {
  await page.getByRole('button', { name: /possíveis duplicados/ }).first().click();
  await page.getByRole('dialog').locator('label').first().click();
  const candidate = page.getByRole('dialog').getByRole('button', { name: /^Visualizar / }).first();
  await candidate.click(); await expect(page.getByRole('heading', { name: 'Registro relacionado', exact: true })).toBeVisible();
  await shot(page, 'Print 03 - Candidato autorizado aberto');
  await page.getByRole('button', { name: 'Voltar', exact: true }).click();
  await expect(page.getByRole('radio').first()).toBeChecked(); await expect(page.getByRole('button', { name: 'Anexar', exact: true })).toBeEnabled();
  await shot(page, 'Print 04 - Duplicidades preservam selecao');
});
test('Sessão OUTRO e catálogos não vazam DIFIS; sessão negada', async ({ page }) => {
  await page.evaluate(async () => { const d = await import('/src/lib/pautaGestor.ts'); const h = await import('/qa/cards/dor011-pauta-gestor-refino/harness.tsx'); h.mountSession({ ...d.SESSAO_SIMULADA, escopo: 'OUTRO', perfil: 'Gestor OUTRO', destinos: ['OUTRO'] }); });
  await expect(page.locator('#audit-root tbody tr')).toHaveCount(3);
  await page.getByRole('button', { name: 'Expandir Dados do registro' }).click(); await page.getByRole('button', { name: 'Órgão', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Órgão de outro escopo (simulado)', exact: true })).toBeVisible(); await expect(page.getByRole('option', { name: 'INEMA', exact: true })).toHaveCount(0);
  await page.goto(url);
  await page.evaluate(async () => { const d = await import('/src/lib/pautaGestor.ts'); const h = await import('/qa/cards/dor011-pauta-gestor-refino/harness.tsx'); h.mountSession({ ...d.SESSAO_SIMULADA, autenticado: false }); });
  await expect(page.locator('#audit-root [role=alert]')).toHaveText('Você não possui permissão para realizar esta ação.'); await expect(page.locator('#audit-root tbody tr')).toHaveCount(0);
});
test('TL005: candidato fora da autorização não aparece nem abre', async ({ page }) => {
  await page.evaluate(async () => { const d = await import('/src/lib/pautaGestor.ts'), m = await import('/src/data/pautaGestorMock.ts'), h = await import('/qa/cards/dor011-pauta-gestor-refino/harness.tsx'); h.mountSession({ ...d.SESSAO_SIMULADA, itensAutorizados: [m.criarRegistrosPauta()[0].id] }); });
  await expect(page.locator('#audit-root tbody tr')).toHaveCount(1); await expect(page.getByRole('button', { name: /possíveis duplicados/ })).toHaveCount(0);
});
test('TL011: documentos, coordenadas, visualização e integração bloqueada', async ({ page }) => {
  await open(page, 'Visualizar'); await page.getByRole('link', { name: '-12.910000, -38.350000', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Documentos relacionados', exact: true })).toBeVisible(); await expect(page.getByText('GeoBahia: integração pendente.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abrir GeoBahia' })).toBeDisabled(); await shot(page, 'Print 05 - TL011 contexto documental');
  await page.getByRole('button', { name: 'Visualizar', exact: true }).first().click(); await expect(page.getByRole('heading', { name: 'Documento relacionado', exact: true })).toBeVisible();
  await expect(page.getByText(/Documento simulado vinculado/)).toBeVisible(); await page.getByRole('button', { name: 'Voltar', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Documentos relacionados', exact: true })).toBeVisible();
});
test('TL010: colunas por guia e duplicados não obrigatórios sem relação', async ({ page }) => {
  await page.getByRole('tab', { name: 'RE', exact: true }).click(); await page.getByRole('button', { name: 'Configurar colunas' }).click();
  await expect(page.getByRole('checkbox', { name: 'Eixo Temático', exact: true })).toHaveCount(0); await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'RT', exact: true }).click(); await page.getByRole('button', { name: 'Configurar colunas' }).click();
  await expect(page.getByRole('checkbox', { name: 'Denunciante/Comunicante', exact: true })).toHaveCount(0); await shot(page, 'Print 06 - Colunas no contexto RT'); await page.keyboard.press('Escape');
  await page.getByRole('tab', { name: 'OF', exact: true }).click(); await page.getByRole('button', { name: 'Configurar colunas' }).click();
  await expect(page.getByRole('checkbox', { name: 'Duplicados', exact: true })).toBeEnabled();
});
for (const search of [false, true]) test('Select teclado completo ' + (search ? 'combobox' : 'listbox'), async ({ page }) => {
  await page.evaluate(async search => { const h = await import('/qa/cards/dor011-pauta-gestor-refino/harness.tsx'); h.mountSelect(search); }, search);
  const trigger = page.getByRole('button', { name: 'Select de regressão' }); await trigger.focus(); await page.keyboard.press('Enter');
  await page.keyboard.press('End'); await page.keyboard.press('Enter'); await expect(page.locator('output')).toHaveText('Xique-Xique'); await expect(trigger).toBeFocused();
  await page.keyboard.press('Space'); await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowUp');
  const owner = search ? page.getByRole('combobox') : page.getByRole('listbox'); await expect(owner).toHaveAttribute('aria-activedescendant', /-0$/);
  await page.keyboard.press(search ? 'Enter' : 'Space'); await expect(page.locator('output')).toHaveText('Abaíra');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Depois', exact: true })).toBeFocused();
  await trigger.focus(); await page.keyboard.press('ArrowUp'); await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('button', { name: 'Antes', exact: true })).toBeFocused();
});
test('Ordenação preservada em paginação, filtro e modal', async ({ page }) => {
  await select(page, 'Ordenar', 'Mais antigos'); await expect(page.locator('tbody tr').first()).toContainText('000112');
  await page.getByRole('button', { name: 'Próxima página' }).click(); const before = await page.locator('tbody').innerText();
  await open(page, 'Visualizar'); await page.getByRole('button', { name: 'Fechar', exact: true }).first().click(); expect(await page.locator('tbody').innerText()).toBe(before);
  await page.getByRole('button', { name: 'Expandir Dados do registro' }).click(); await page.getByRole('textbox', { name: 'Palavra-chave', exact: true }).fill('resíduos'); await page.getByRole('button', { name: 'Consultar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ordenar', exact: true })).toHaveText('Mais antigos'); await expect(page.getByRole('columnheader', { name: /data/i })).toHaveAttribute('aria-sort', 'ascending');
});
test('Troca RE para RD limpa emergência; limpar espera nova consulta', async ({ page }) => {
  await page.getByRole('tab', { name: 'RE', exact: true }).click(); await page.getByRole('button', { name: 'Expandir Classificação' }).click();
  await select(page, 'Tipo de Emergência', 'Outros'); await page.getByRole('button', { name: 'Consultar', exact: true }).click(); await expect(page.locator('tbody tr')).toHaveCount(0);
  await page.getByRole('tab', { name: 'RD', exact: true }).click(); await expect(page.locator('tbody tr')).toHaveCount(4);
  await page.getByRole('tab', { name: 'RE', exact: true }).click(); await expect(page.getByRole('button', { name: 'Tipo de Emergência', exact: true })).toHaveText('Todos');
});
test('Upload: múltiplos, vazio, remoção da seleção e nome longo', async ({ page }) => {
  await open(page, 'Arquivos');
  await page.locator('input[type=file]').setInputFiles([{ name: 'vazio.txt', mimeType: 'text/plain', buffer: Buffer.alloc(0) }, { name: 'nome-muito-longo-' + 'a'.repeat(150) + '.kml', mimeType: 'text/plain', buffer: Buffer.from('simulado') }]);
  await expect(page.getByRole('button', { name: 'Adicionar arquivos', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Remover vazio.txt', exact: true }).click(); await expect(page.getByRole('cell', { name: 'vazio.txt', exact: true })).toHaveCount(0);
  await shot(page, 'Print 07 - Upload multiplo nome longo e remocao');
  await page.getByRole('button', { name: 'Adicionar arquivos', exact: true }).click(); await open(page, 'Visualizar'); await expect(page.getByRole('link', { name: /^nome-muito-longo/ })).toBeVisible();
});
test('Anexação: cancelar, confirmar duas vezes e histórico único', async ({ page }) => {
  await page.getByRole('button', { name: /possíveis duplicados/ }).first().click(); await page.getByRole('dialog').locator('label').first().click();
  await page.getByRole('button', { name: 'Anexar', exact: true }).click(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('radio').first()).toBeChecked(); await page.getByRole('button', { name: 'Anexar', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmar', exact: true }).evaluate(el => { el.click(); el.click(); });
  await expect(page.getByRole('status')).toContainText('Item anexado com sucesso.'); await open(page, 'Visualizar');
  await expect(page.getByText('Anexar', { exact: true })).toHaveCount(1);
});
test('FullHD e 4K: shell preservado, SLA e nenhuma quebra de viewport', async ({ page }) => {
  await expect(page.locator('tbody tr')).toHaveCount(10); await shot(page, 'Print 01 - FullHD pauta final');
  await page.setViewportSize({ width: 3840, height: 2160 }); await shot(page, 'Print 08 - 4K pauta final'); await page.getByRole('button', { name: 'Expandir Localização' }).click(); await page.getByRole('button', { name: 'Município', exact: true }).click(); await shot(page, 'Print 09 - 4K catalogo e foco');
});
test('390px: tabs grid e modal não ampliam documento', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await shot(page, 'Print 10 - Estreita pauta final');
  await open(page, 'Arquivar'); await select(page, 'Motivo do arquivamento', 'Outros'); await shot(page, 'Print 11 - Estreita modal arquivar');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
for (const route of ['uc-agendamento', 'fauna-especies', 'seia-v2']) test('Regressão de rota: ' + route, async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:3000/?rota=' + route); await expect(page.locator('h1').first()).toBeVisible();
  if (route === 'uc-agendamento') await page.getByRole('button', { name: 'Novo Agendamento', exact: true }).click();
  if (route === 'fauna-especies') await page.getByRole('button', { name: 'Nova Espécie', exact: true }).click();
  const control = page.locator('.fi-select-trigger:visible').first();
  if (route !== 'seia-v2') await expect(control).toBeVisible();
  if (await control.count()) { await control.focus(); await page.keyboard.press('ArrowDown'); await expect(page.getByRole('listbox')).toBeVisible(); await page.keyboard.press('Escape'); await expect(control).toBeFocused(); }
  expect(errors).toEqual([]);
});
