const { chromium, expect } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PAUTA_URL || 'http://127.0.0.1:3000/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';
const resultados = [];
const prints = process.env.PAUTA_PRINTS || path.join(__dirname, 'prints');
fs.mkdirSync(prints, { recursive: true });
const diagnosticos = path.join(__dirname, 'diagnosticos');
fs.mkdirSync(diagnosticos, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const reset = async () => { await page.goto(base); await expect(page.getByRole('heading', { name: 'Pauta do Gestor - Registros', exact: true })).toBeVisible(); await expect(page.locator('.pauta-gestor tbody tr')).toHaveCount(10); };
  const caso = async (nome, tarefa) => {
    try { await reset(); await tarefa(); resultados.push({ nome, status: 'PASS' }); console.log(`PASS ${nome}`); }
    catch (e) { resultados.push({ nome, status: 'FAIL', erro: e.message }); console.log(`FAIL ${nome}: ${e.message}`); await page.screenshot({ path: path.join(diagnosticos, `Falha ${resultados.length}.png`) }); }
  };
  const select = async (label, option) => { await page.getByRole('button', { name: label, exact: true }).click(); await page.getByRole('option', { name: option, exact: true }).click(); };
  const abrir = async acao => { await page.getByRole('button', { name: /^Ações de/ }).first().click(); await page.getByRole('button', { name: acao, exact: true }).click(); };
  const shot = async nome => page.screenshot({ path: path.join(prints, nome), animations: 'disabled' });
  if (!process.env.PAUTA_PRODUCTION) await caso('Regras puras: SLA, pesquisa, geoprocessamento, autorização e transações', async () => {
    const verificacoes = await page.evaluate(async () => {
      const d = await import('/src/lib/pautaGestor.ts');
      const m = await import('/src/data/pautaGestorMock.ts');
      const tests = [];
      const check = (nome, resultado) => tests.push({ nome, pass: !!resultado });
      const erro = (fn, mensagem) => { try { fn(); return false; } catch (e) { return e.message === mensagem; } };
      const rows = m.criarRegistrosPauta();
      const sessao = d.SESSAO_SIMULADA;
      const cmd = (acao, id = rows[0].id) => ({ acao, id, versao: rows.find(r => r.id === id).versao, versoes: Object.fromEntries(rows.map(r => [r.id, r.versao])) });
      check('limites SLA', [0, 89, 90, 149, 150, 180, 181, 190].map(m.nivelSla).join() === 'gray,gray,warning,warning,orange,orange,danger,danger');
      check('datas incompletas', d.validarFiltros({ ...d.FILTROS_VAZIOS, inicial: '2026-10-05' }) === d.MSG[5]);
      check('datas invertidas', d.validarFiltros({ ...d.FILTROS_VAZIOS, inicial: '2026-10-05', final: '2026-10-04' }) === d.MSG[5]);
      check('CPF/CNPJ', d.documentoValido('529.982.247-25') && d.documentoValido('04.252.011/0001-10') && !d.documentoValido('00000000000'));
      check('palavras inteiras e acentos', d.consultarPauta(rows, 'Todos', { ...d.FILTROS_VAZIOS, palavra: 'residuos sólidos' }, sessao).length === 3 && d.consultarPauta(rows, 'Todos', { ...d.FILTROS_VAZIOS, palavra: 'resid' }, sessao).length === 0);
      check('número exato', d.consultarPauta(rows, 'Todos', { ...d.FILTROS_VAZIOS, numero: rows[0].numero }, sessao).length === 1 && !d.consultarPauta(rows, 'Todos', { ...d.FILTROS_VAZIOS, numero: '000101' }, sessao).length);
      check('filtros recolhidos não aplicados', d.filtrosDaConsulta({ ...d.FILTROS_VAZIOS, palavra: 'texto' }, { dados: false, localizacao: false, periodo: false, classificacao: false }).palavra === '');
      check('filtro inaplicável limpo', !d.limparInaplicaveis({ ...d.FILTROS_VAZIOS, origem: 'Ofício', emergencia: 'Outros' }, 'RT').origem);
      const gms = d.lerCoordenada('12°54\'36"S 38°21\'00"W', 'Grau/Minuto/Segundo');
      check('GMS válido', Math.abs(gms.lat + 12.91) < 1e-6 && Math.abs(gms.lng + 38.35) < 1e-6);
      check('GMS inválido', !d.lerCoordenada('12°99\'36"S 38°21\'00"W', 'Grau/Minuto/Segundo'));
      check('decimal inválido', !d.lerCoordenada('91, 0', 'Grau Decimal') && !d.lerCoordenada('12', 'Grau Decimal'));
      const utm = d.lerCoordenada('24S 500000 8894587.5087', 'UTM');
      check('UTM referência conhecida', Math.abs(utm.lng + 39) < 1e-6 && Math.abs(utm.lat + 10) < 1e-6);
      check('UTM inválido', !d.lerCoordenada('61S 500000 8894587', 'UTM'));
      check('CAR amplia ponto à poligonal', d.consultarPauta(rows, 'Todos', { ...d.FILTROS_VAZIOS, coordenada: '-12.9105, -38.3505' }, sessao).length === 3);
      check('fonte espacial documento', d.referenciaEspacial(rows[2]).fonte.startsWith('Nota Técnica'));
      check('fallback município', d.referenciaEspacial(rows[6]).fonte === 'Município');
      check('sem referência espacial', !d.referenciaEspacial({ ...rows[6], municipio: '' }));
      check('RA e AC vazias', !d.consultarPauta(rows, 'RA', d.FILTROS_VAZIOS, sessao).length && !d.consultarPauta(rows, 'AC', d.FILTROS_VAZIOS, sessao).length);
      check('direto não autorizado', !d.acessoPauta({ ...sessao, interno: false }) && erro(() => d.executarComando(rows, cmd('arquivar'), { ...sessao, permissoes: ['visualizar'] }), d.MSG[3]));
      check('escopo não autorizado', erro(() => d.executarComando(rows, cmd('arquivar'), { ...sessao, escopo: 'OUTRO' }), d.MSG[3]));
      check('arquivar sem justificativa', erro(() => d.executarComando(rows, { ...cmd('arquivar'), motivo: 'Outros' }, sessao), d.MSG[9]));
      check('Outros sem descrição', erro(() => d.executarComando(rows, { ...cmd('arquivar'), motivo: 'Outros', justificativa: 'Teste' }, sessao), d.MSG[10]));
      check('versão concorrente', erro(() => d.executarComando(rows, { ...cmd('arquivar'), versao: 0 }, sessao), d.MSG[30]));
      const initial = JSON.stringify(rows);
      const anexados = d.executarComando(rows, { ...cmd('anexar'), destino: rows[3].id }, sessao).registros;
      check('pai mais antigo', anexados[0].pai === rows[3].id && anexados[3].pai === rows[3].id);
      check('snapshot intacto', JSON.stringify(rows) === initial);
      const c2 = { acao: 'desanexar', id: rows[0].id, versao: anexados[0].versao, versoes: Object.fromEntries(anexados.map(r => [r.id, r.versao])) };
      check('desanexar exige justificativa', erro(() => d.executarComando(anexados, c2, sessao), d.MSG[20]));
      const separados = d.executarComando(anexados, { ...c2, justificativa: 'Registros independentes após análise.' }, sessao).registros;
      check('desanexar retorna análise', !separados[0].pai && !separados[3].pai && separados[0].status === 'Em Análise Técnica' && separados[3].status === 'Em Análise Técnica');
      const processo = d.executarComando(rows, { ...cmd('anexar'), destino: d.PROCESSOS_SIMULADOS[0].id }, sessao).registros[0];
      check('processo pai', processo.pai === d.PROCESSOS_SIMULADOS[0].id && processo.processo === processo.pai);
      check('evitar reanexar ao pai', !d.duplicidades(processo, rows, undefined, sessao).some(r => r.id === processo.pai));
      check('conversões condicionais', !d.podeExecutar(sessao, rows[0], 'converter') && !d.podeExecutar(sessao, rows[4], 'converter'));
      const comentario = d.executarComando(rows, { ...cmd('comentario'), comentario: 'Verificação técnica.' }, sessao).registros[0];
      check('comentário não altera SLA/status/responsável', comentario.status === rows[0].status && comentario.responsavel === rows[0].responsavel && comentario.data === rows[0].data && comentario.historico.length === 2);
      check('upload formatos', d.EXTENSOES_ARQUIVOS.every(e => d.arquivoPermitido(`documento.${e}`)) && !d.arquivoPermitido('documento.exe'));
      check('falha integral upload', erro(() => d.executarComando(rows, { ...cmd('arquivos'), arquivos: [{ nome: 'a.txt', tamanho: 1 }, { nome: 'b.exe', tamanho: 1 }] }, sessao), d.MSG[32]) && JSON.stringify(rows) === initial);
      const encaminhado = d.executarComando(rows, { ...cmd('encaminhar'), destino: 'UR Metropolitana' }, sessao).registros[0];
      check('encaminhamento auditado', encaminhado.status === 'Encaminhado' && encaminhado.responsavel === 'UR Metropolitana' && encaminhado.historico[1].perfil === sessao.perfil);
      check('ofício/processo sem inventar contrato', erro(() => d.executarComando(rows, cmd('processo'), sessao), d.MSG[3]) && erro(() => d.executarComando(rows, cmd('oficio'), sessao), d.MSG[3]));
      return tests;
    });
    for (const v of verificacoes) assert.ok(v.pass, v.nome);
    console.log(`  ${verificacoes.length} verificações de regras PASS`);
    resultados.push(...verificacoes.map(v => ({ nome: v.nome, status: v.pass ? 'PASS' : 'FAIL' })));
  });
  await caso('Guias, quatro grupos fechados e RA/AC sem dados', async () => {
    await expect(page.getByRole('tab')).toHaveCount(8);
    await expect(page.getByRole('button', { name: /^Expandir / })).toHaveCount(4);
    for (const nome of ['RD', 'RE', 'RC', 'RT', 'OF']) { await page.getByRole('tab', { name: nome, exact: true }).click(); await expect(page.locator('tbody tr').first()).toBeVisible(); }
    for (const nome of ['RA', 'AC']) { await page.getByRole('tab', { name: nome, exact: true }).click(); await expect(page.getByRole('heading', { name: 'Não há dados disponíveis', exact: true })).toBeVisible(); await expect(page.locator('tbody tr')).toHaveCount(0); }
    await shot('Print 14 - AC vazia no escopo exclusivo.png');
  });
  await caso('Filtros dependentes e busca textual com contexto preservado', async () => {
    await page.getByRole('button', { name: 'Expandir Dados do registro', exact: true }).click();
    await select('Origem', 'Ofício'); await expect(page.getByRole('button', { name: 'Setor de origem', exact: true })).toBeVisible();
    await select('Órgão', 'Prefeitura Municipal'); await select('Origem', 'E-mail');
    await expect(page.getByRole('button', { name: 'Órgão', exact: true })).toHaveText('Todos');
    await select('Origem', 'Ouvidoria'); await expect(page.getByRole('button', { name: 'Setor de origem', exact: true })).toHaveCount(0);
    await select('Origem', 'Todos');
    await page.getByRole('textbox', { name: 'Palavra-chave', exact: true }).fill('residuos sólidos');
    await page.getByRole('button', { name: 'Consultar', exact: true }).click(); await expect(page.locator('tbody tr')).toHaveCount(3);
    await page.getByRole('button', { name: 'Recolher Dados do registro', exact: true }).click();
    await page.getByRole('button', { name: 'Consultar', exact: true }).click(); await expect(page.locator('tbody tr')).toHaveCount(10);
    await page.getByRole('button', { name: 'Expandir Dados do registro', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Palavra-chave', exact: true })).toHaveValue('residuos sólidos');
    await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click(); await expect(page.getByRole('textbox', { name: 'Palavra-chave', exact: true })).toHaveValue('');
    await page.getByRole('textbox', { name: 'Palavra-chave', exact: true }).fill('palavrainexistente'); await page.getByRole('button', { name: 'Consultar', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Nenhum registro foi encontrado para os critérios informados.', exact: true })).toBeVisible();
    await shot('Print 15 - Consulta sem resultados.png');
  });
  await caso('Datas vinculadas rejeitam critérios e preservam resultados', async () => {
    await page.getByRole('button', { name: 'Expandir Período e situação', exact: true }).click();
    await page.getByRole('textbox', { name: 'Data inicial', exact: true }).fill('2026-10-05');
    await page.getByRole('button', { name: 'Consultar', exact: true }).click(); await expect(page.getByRole('alert')).toHaveText('Informe a data inicial e a data final. A data final não pode ser anterior à data inicial.'); await expect(page.locator('tbody tr')).toHaveCount(10);
  });
  await caso('Colunas obrigatórias, aplicar/cancelar, ordenação e paginação', async () => {
    await page.getByRole('button', { name: 'Configurar colunas', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'Ações', exact: true })).toBeDisabled(); await expect(page.getByRole('checkbox', { name: 'Duplicados', exact: true })).toBeDisabled();
    await page.getByRole('dialog').getByText('Municípios', { exact: true }).click(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click(); await expect(page.getByRole('columnheader', { name: 'Municípios', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Configurar colunas', exact: true }).click(); await page.getByRole('dialog').getByText('Municípios', { exact: true }).click(); await page.getByRole('button', { name: 'Aplicar', exact: true }).click(); await expect(page.getByRole('columnheader', { name: 'Municípios', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Próxima página', exact: true }).click(); await expect(page.locator('tbody tr')).toHaveCount(3);
    await page.getByRole('button', { name: 'Ordenar data crescente', exact: true }).click(); await expect(page.locator('tbody tr').first()).toContainText('000112');
  });
  await caso('Anexar pai antigo, desanexar exige justificativa e devolve à análise', async () => {
    await page.getByRole('button', { name: /possíveis duplicados/ }).first().click(); await page.getByRole('dialog').locator('label').first().click(); await page.getByRole('button', { name: 'Anexar', exact: true }).click();
    await expect(page.getByText('Deseja anexar o item selecionado a este registro?', { exact: true })).toBeVisible(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('Item anexado com sucesso.');
    await abrir('Desanexar'); await page.getByRole('button', { name: 'Desanexar', exact: true }).click(); await expect(page.getByRole('alert')).toHaveText('Informe a justificativa para desanexar os registros.');
    await shot('Print 16 - Desanexar exige justificativa.png');
    await page.getByRole('textbox', { name: 'Justificativa', exact: true }).fill('Vistoria confirmou ocorrências independentes.'); await page.getByRole('button', { name: 'Desanexar', exact: true }).click(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click();
    await expect(page.locator('tbody tr').first()).toContainText('Em Análise Técnica');
  });
  await caso('Arquivamento Outros, cancelar sem mudança e confirmar', async () => {
    await abrir('Arquivar'); await select('Motivo do arquivamento', 'Outros'); await page.getByRole('textbox', { name: 'Justificativa', exact: true }).fill('Verificação concluída.'); await page.getByRole('button', { name: 'Arquivar', exact: true }).click(); await expect(page.getByRole('alert')).toHaveText('Descreva o motivo do arquivamento ao selecionar Outros.');
    await page.getByRole('textbox', { name: 'Descrição do motivo', exact: true }).fill('Encerramento por determinação fundamentada.'); await page.getByRole('button', { name: 'Arquivar', exact: true }).click(); await page.getByRole('button', { name: 'Cancelar', exact: true }).click(); await expect(page.locator('tbody tr').first()).toContainText('Registrado');
    await page.getByRole('button', { name: 'Arquivar', exact: true }).click(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click(); await expect(page.locator('tbody tr').first()).toContainText('Arquivado');
  });
  await caso('Encaminhar, alterar eixo e comentário com histórico', async () => {
    await abrir('Encaminhar'); await select('Destino', 'UR Metropolitana'); await page.getByRole('button', { name: 'Encaminhar', exact: true }).click(); await page.getByRole('button', { name: 'Confirmar', exact: true }).click(); await expect(page.locator('tbody tr').first()).toContainText('Encaminhado');
    await abrir('Alterar Eixo'); await select('Eixo Temático', 'Indústria'); await expect(page.getByRole('button', { name: 'Subitem', exact: true })).toHaveText('Selecione...'); await select('Subitem', 'Efluentes'); await page.getByRole('button', { name: 'Salvar', exact: true }).click();
    await abrir('Adicionar comentário'); await page.getByRole('textbox', { name: 'Comentário', exact: true }).fill('Solicitada vistoria complementar.'); await page.getByRole('button', { name: 'Adicionar comentário', exact: true }).click();
    await abrir('Visualizar'); await expect(page.getByText('Solicitada vistoria complementar.', { exact: true })).toBeVisible(); await expect(page.getByText('Indústria / Efluentes', { exact: true })).toBeVisible(); await shot('Print 17 - Historico de operacoes.png');
  });
  await caso('Upload múltiplo valida formatos antes de adicionar', async () => {
    await abrir('Arquivos');
    await page.locator('input[type=file]').setInputFiles({ name: 'invalido.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('teste') }); await expect(page.getByRole('alert')).toHaveText('O arquivo selecionado possui formato não permitido.');
    await page.locator('input[type=file]').setInputFiles([{ name: 'vistoria.txt', mimeType: 'text/plain', buffer: Buffer.from('Dados simulados da vistoria.') }, { name: 'ponto.kml', mimeType: 'application/vnd.google-earth.kml+xml', buffer: Buffer.from('<kml/>') }]); await expect(page.getByRole('button', { name: 'Adicionar arquivos', exact: true })).toBeEnabled(); await shot('Print 18 - Arquivos selecionados.png');
    await page.getByRole('button', { name: 'Adicionar arquivos', exact: true }).click(); await abrir('Visualizar'); await expect(page.getByRole('link', { name: 'vistoria.txt', exact: true })).toBeVisible();
  });
  await caso('Coordenada clicável e falha GeoBahia sem perda de contexto', async () => {
    await abrir('Visualizar'); await page.getByRole('link', { name: '-12.910000, -38.350000', exact: true }).first().click(); await expect(page.getByRole('heading', { name: 'Visualizar informações geoespaciais', exact: true })).toBeVisible(); await expect(page.getByRole('button', { name: 'Abrir GeoBahia', exact: true })).toBeDisabled(); await expect(page.getByText('GeoBahia: integração pendente.', { exact: true })).toBeVisible(); await shot('Print 19 - GeoBahia contrato pendente.png');
  });
  await caso('Contratos pendentes ficam bloqueados sem fabricar operações', async () => {
    await page.getByRole('button', { name: /^Ações de/ }).first().click();
    for (const acao of ['Gerar PDF', 'Gerar Ofício', 'Formar Processo', 'Converter', 'GeoBahia']) await expect(page.getByRole('button', { name: acao, exact: true })).toBeDisabled();
    await shot('Print 20 - Operacoes externas bloqueadas.png');
  });
  await caso('Retorno ao contexto da lista e foco verde', async () => {
    await page.getByRole('button', { name: 'Próxima página', exact: true }).click(); const numero = await page.locator('tbody tr').first().textContent();
    const trigger = page.getByRole('button', { name: /^Ações de/ }).first(); await trigger.click(); await page.getByRole('button', { name: 'Fechar', exact: true }).first().click(); await expect(page.locator('tbody tr').first()).toHaveText(numero); await expect(trigger).toBeFocused();
    await trigger.focus(); const cor = await trigger.evaluate(el => getComputedStyle(el).getPropertyValue('--color-border-focus')); assert.ok(cor.trim());
  });
  await caso('Tela estreita mantém tabs, filtros e grid sem cortar viewport', async () => {
    await page.setViewportSize({ width: 390, height: 844 }); await page.getByRole('tab', { name: 'Todos', exact: true }).click(); await expect(page.getByRole('button', { name: 'Expandir Dados do registro', exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth); assert.equal(overflow, false, 'overflow horizontal do documento'); await shot('Print 21 - Tela estreita.png'); await page.setViewportSize({ width: 1920, height: 1080 });
  });
  assert.equal(errors.length, 0, errors.join('\n'));
  fs.writeFileSync(path.join(__dirname, process.env.PAUTA_PRODUCTION ? 'resultado-producao.json' : 'resultado-qa.json'), JSON.stringify({ url: base, data: new Date().toISOString(), resultados, errors }, null, 2));
  await browser.close();
  const falhas = resultados.filter(r => r.status === 'FAIL');
  console.log(`${resultados.length - falhas.length}/${resultados.length} verificações PASS; erros de console: ${errors.length}`);
  if (falhas.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
