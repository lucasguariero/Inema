const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const url=process.env.PAUTA_URL||'http://127.0.0.1:3000/?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor';
const prints=path.join(__dirname,'prints');fs.mkdirSync(prints,{recursive:true});
const shot=(page,name)=>page.screenshot({path:path.join(prints,name+'.png'),animations:'disabled'});
const pick=async(page,label,value)=>{await page.getByRole('button',{name:label,exact:true}).click();await page.getByRole('option',{name:value,exact:true}).click();};
const open=async(page,name)=>{await page.getByRole('button',{name:/^Ações de/}).first().click();await page.getByRole('button',{name,exact:true}).click();};
test.beforeEach(async({page})=>{await page.goto(url);await expect(page.locator('h1')).toContainText('Pauta do Gestor - Registros');});
test('M01 anexos: sem parsing, fonte explícita, prioridade e upload RN036',async({page})=>{
  const result=await page.evaluate(async()=>{
    const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts');
    const rows=m.criarRegistrosPauta(),r=rows[0],base={...r,coordenada:undefined,documentos:[],coordenadaDocumento:undefined};
    const ordinary={...base,arquivos:[{nome:'ponto.kml',tamanho:1},{nome:'mapa.zip',tamanho:1}]};
    const structured={...base,arquivos:r.arquivos};
    const noRef={...ordinary,municipio:''};
    const invalid={...base,arquivos:[{...r.arquivos[1],documento:{...r.arquivos[1].documento,coordenada:{lat:91,lng:0}}}]};
    const command={acao:'arquivos',id:r.id,versao:r.versao,versoes:Object.fromEntries(rows.map(v=>[v.id,v.versao])),arquivos:[{nome:'upload.pdf',tamanho:10}]};
    const added=d.executarComando(rows,command,d.SESSAO_SIMULADA).registros[0];
    return {ordinary:d.referenciasEspaciais(ordinary),fallback:d.referenciaEspacial(ordinary),structured:d.referenciasEspaciais(structured),primary:d.referenciaEspacial(structured),noRef:d.referenciaEspacial(noRef),invalid:d.referenciasEspaciais(invalid),sources:d.referenciasEspaciais(r).map(v=>v.origem),added:added.arquivos.at(-1),referencesBefore:d.referenciasEspaciais(r).length,referencesAfter:d.referenciasEspaciais(added).length};
  });
  expect(result.ordinary).toEqual([]);expect(result.fallback.fonte).toBe('Município');expect(result.noRef).toBeNull();expect(result.invalid).toEqual([]);
  expect(result.structured).toHaveLength(1);expect(result.structured[0].origem).toBe('Anexo');expect(result.primary.fonte).toMatch(/^Anexo:/);
  expect(new Set(result.sources)).toEqual(new Set(['Registro','Documento relacionado','Anexo']));
  expect(result.added).toEqual({nome:'upload.pdf',tamanho:10});expect(result.referencesAfter).toBe(result.referencesBefore);
});
test('M02 TL011 lista anexos comuns e metadados, volta sem perder contexto',async({page})=>{
  await open(page,'Adicionar arquivo');await page.locator('input[type=file]').setInputFiles({name:'upload-sem-georreferencia.txt',mimeType:'text/plain',buffer:Buffer.from('Sem coordenadas')});
  await page.getByRole('button',{name:'Adicionar arquivo',exact:true}).click();
  await open(page,'Visualizar');await page.getByRole('link',{name:'-12.910000, -38.350000',exact:true}).first().click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByText('comprovante-recebimento.pdf',{exact:true})).toBeVisible();
  await expect(dialog.getByText('upload-sem-georreferencia.txt',{exact:true})).toBeVisible();
  await expect(dialog.getByRole('link',{name:'Visualizar',exact:true})).toHaveAttribute('href',/^blob:/);
  await expect(dialog.getByText(/Anexo · nota-tecnica-localizacao.pdf/)).toBeVisible();
  await expect(dialog.getByText('-12.910200, -38.350200',{exact:true})).toBeVisible();
  await expect(dialog.getByRole('button',{name:'Abrir GeoBahia',exact:true})).toBeDisabled();
  await shot(page,'Print 22 - TL011 anexos e fontes FullHD');
  await dialog.getByRole('button',{name:'Visualizar metadados',exact:true}).click();await expect(dialog.getByText(/Não houve leitura ou extração/)).toBeVisible();
  await dialog.getByRole('button',{name:'Voltar',exact:true}).click();await expect(dialog.getByText('comprovante-recebimento.pdf',{exact:true})).toBeVisible();
  await page.setViewportSize({width:390,height:844});await shot(page,'Print 23 - TL011 anexos 390px');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('M03 política negativa: ausência, permissão, escopo, status, relação e allow explícito',async({page})=>{
  const result=await page.evaluate(async()=>{
    const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts');
    const rows=m.criarRegistrosPauta(),s=d.SESSAO_SIMULADA,r=rows[0],cmd={acao:'arquivar',id:r.id,versao:r.versao,versoes:Object.fromEntries(rows.map(v=>[v.id,v.versao])),motivo:'Informações insuficientes',justificativa:'Ensaio negativo'};
    const cases=[
      ['sem regra',{...s,regrasAcoes:{}},r],
      ['sem permissão',{...s,permissoes:['visualizar']},r],
      ['fora escopo',{...s,escopo:'OUTRO'},r],
      ['status incompatível',s,{...r,status:'Arquivado'}],
      ['relação incompatível',{...s,regrasAcoes:{arquivar:{...s.regrasAcoes.arquivar,relacionamento:'sem-relacao'}}},{...r,pai:'x'}],
    ];
    return {cases:cases.map(([name,session,record])=>{
      const data=[record,...rows.slice(1)],before=JSON.stringify(data);
      let message='';try{d.executarComando(data,cmd,session);}catch(e){message=e.message;}
      return {name,allowed:d.podeExecutar(session,record,'arquivar'),message,unchanged:JSON.stringify(data)===before};
    }),allow:d.podeExecutar(s,r,'arquivar'),corporate:false};
  });
  for(const c of result.cases){expect(c.allowed,c.name).toBe(false);expect(c.message,c.name).toBe('Você não possui permissão para realizar esta ação.');expect(c.unchanged,c.name).toBe(true);}
  expect(result.allow).toBe(true);fs.writeFileSync(path.join(__dirname,'logs','politica-negativa.json'),JSON.stringify(result,null,2));
});
for(const [name,outside,inicial] of [['escopo',true,'visualizar'],['permissão',false,'arquivar'],['estado inválido',false,'converter']])test('M04 abertura direta negada: '+name,async({page})=>{
  await page.evaluate(async({outside,inicial})=>{
    const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');
    const rows=m.criarRegistrosPauta();h.mountDialog(outside?rows.find(r=>r.escopo==='OUTRO'):rows[0],rows,{...d.SESSAO_SIMULADA,permissoes:['visualizar']},inicial);
  },{outside,inicial});
  await expect(page.getByRole('heading',{name:'Acesso negado'})).toBeVisible();await expect(page.getByRole('dialog')).toContainText('Você não possui permissão para realizar esta ação.');
  await expect(page.getByRole('dialog').getByRole('button',{name:/Arquivar|Confirmar/})).toHaveCount(0);
});
test('M05 catálogos, filtros, dados pessoais e duplicados respeitam allowlist e OUTRO',async({page})=>{
  for(const scope of ['DIFIS','OUTRO']){
    await page.goto(url);await page.evaluate(async scope=>{
      const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');
      const rows=m.criarRegistrosPauta(),id=rows.find(r=>r.escopo===scope).id;
      h.mountSession({...d.SESSAO_SIMULADA,escopo:scope,itensAutorizados:[id],verDemandante:false});
    },scope);
    await expect(page.locator('#audit-root tbody tr')).toHaveCount(1);
    await expect(page.getByRole('button',{name:/possíveis duplicados/})).toHaveCount(0);
    await page.getByRole('button',{name:'Expandir Dados do registro'}).click();await expect(page.getByRole('textbox',{name:'Demandante',exact:true})).toHaveCount(0);
    await page.getByRole('button',{name:'Órgão',exact:true}).click();
    const options=await page.getByRole('option').allTextContents();expect(options).toEqual(['Todos',scope==='DIFIS'?'INEMA':'Órgão de outro escopo (simulado)']);await page.keyboard.press('Escape');
    await open(page,'Visualizar');await expect(page.getByRole('dialog').getByText('Demandante',{exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Fechar',exact:true}).first().click();
  }
});
const columnAudit=[];
test('M12 comparação literal MSG001–034 e rótulos BOT corrigidos',async({page})=>{
  const esperado=JSON.parse(fs.readFileSync(path.join(__dirname,'mensagens-pdf.json'),'utf8'));
  const actual=await page.evaluate(async()=>{const d=await import('/src/lib/pautaGestor.ts');return {mensagens:d.MSG,acoes:d.ACOES};});
  expect(actual.mensagens).toEqual(esperado);
  expect(actual.acoes).toMatchObject({arquivos:'Adicionar arquivo',converter:'Converter Registro',eixo:'Alterar eixo temático',geo:'Visualizar informações geoespaciais'});
  await page.getByRole('button',{name:/^Ações de/}).first().click();
  for(const name of ['Adicionar arquivo','Converter Registro','Alterar eixo temático','Visualizar informações geoespaciais'])await expect(page.getByRole('dialog').getByRole('button',{name,exact:true})).toBeVisible();
  for(const name of ['Converter Registro','Visualizar informações geoespaciais'])await expect(page.getByRole('dialog').getByRole('button',{name,exact:true})).toBeDisabled();
  fs.writeFileSync(path.join(__dirname,'logs','auditoria-literal.json'),JSON.stringify({fonte:'PDF DOR011 original, páginas físicas 10–12; espaços de quebra de linha normalizados',mensagens:actual.mensagens,labels:actual.acoes,observacao:'Literalidade das constantes não comprova execução de serviços ausentes.'},null,2));
});
for(const tab of ['Todos','RD','RE','RA','RC','RT','OF','AC'])test('M06 colunas contextuais: '+tab,async({page})=>{
  const expected=await page.evaluate(async tab=>{
    const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),c=await import('/src/lib/pautaColunas.ts');
    const rows=m.criarRegistrosPauta(),selected=d.consultarPauta(rows,tab,d.FILTROS_VAZIOS,d.SESSAO_SIMULADA);
    return {tab,count:selected.length,applicable:c.colunasAplicaveis(tab,d.SESSAO_SIMULADA),required:c.colunasObrigatorias(selected,rows,d.SESSAO_SIMULADA),labels:c.COLUNAS};
  },tab);
  await page.getByRole('tab',{name:tab,exact:true}).click();
  await expect(page.getByRole('button',{name:'Próxima página',exact:true})).toHaveCount(expected.count>10?1:0);
  await expect(page.getByRole('button',{name:'Página anterior',exact:true})).toHaveCount(expected.count>10?1:0);
  if(['RA','AC'].includes(tab)){await expect(page.getByText('Não há dados disponíveis para esta guia.',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Configurar colunas'})).toHaveCount(0);expect(expected.required).toEqual([]);}
  else {
    await page.getByRole('button',{name:'Configurar colunas'}).click();
    const actual=await page.getByRole('dialog').getByRole('checkbox').evaluateAll(el=>el.map(e=>e.id.replace('coluna-','')));
    expect(actual).toEqual(expected.applicable);
    for(const c of expected.applicable)await expect(page.getByRole('checkbox',{name:expected.labels[c],exact:true}))[expected.required.includes(c)?'toBeDisabled':'toBeEnabled']();
    if(tab==='Todos')await shot(page,'Print 24 - Configurador colunas condicionais');
  }
  expect(expected.applicable.includes('eixo')).toBe(['Todos','RD','RT','RC','RA'].includes(tab));
  expect(expected.applicable.includes('demandante')).toBe(['Todos','RD','RE','RC'].includes(tab));
  columnAudit.push({...expected,offered:['RA','AC'].includes(tab)?[]:expected.applicable});
  fs.writeFileSync(path.join(__dirname,'logs','colunas-oito-guias.json'),JSON.stringify(columnAudit,null,2));
});
test('M07 TL005 ciclo completo preserva filtro, guia, página e seleção',async({page})=>{
  await page.evaluate(async()=>{
    const d=await import('/src/lib/pautaGestor.ts'),m=await import('/src/data/pautaGestorMock.ts'),h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');
    const base=m.criarRegistrosPauta()[0],rows=Array.from({length:22},(_,i)=>({...structuredClone(base),id:'ensaio-'+i,numero:'SIM-RD-'+String(i).padStart(3,'0'),data:i===21?'2025-01-01':base.data,documentos:[],arquivos:[]}));
    h.mountSession(d.SESSAO_SIMULADA,rows);
  });
  await page.getByRole('tab',{name:'RD',exact:true}).click();await page.getByRole('button',{name:'Expandir Localização'}).click();await pick(page,'Município','Salvador');await page.getByRole('button',{name:'Consultar',exact:true}).click();
  await page.getByRole('button',{name:'Próxima página'}).click();await expect(page.getByText('11–20 de 22 registros',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:/possíveis duplicados/}).first().click();const dialog=page.getByRole('dialog');
  const selected=dialog.getByRole('radio').first();await dialog.locator('label').first().click();
  await dialog.getByRole('button',{name:/^Visualizar SIM/}).first().click();await expect(dialog.getByRole('heading',{name:'Registro relacionado',exact:true})).toBeVisible();
  await dialog.getByRole('button',{name:'Voltar',exact:true}).click();await expect(selected).toBeChecked();
  await shot(page,'Print 25 - TL005 selecao e contexto pagina 2');
  await dialog.getByRole('button',{name:'Anexar',exact:true}).click();await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(selected).toBeChecked();
  await dialog.getByRole('button',{name:'Anexar',exact:true}).click();await dialog.getByRole('button',{name:'Confirmar',exact:true}).evaluate(e=>{e.click();e.click();});
  await expect(page.getByRole('status')).toContainText('Item anexado com sucesso.');await expect(page.getByText('11–20 de 22 registros',{exact:true})).toBeVisible();
  await expect(page.getByRole('tab',{name:'RD',exact:true})).toHaveAttribute('aria-selected','true');await expect(page.getByRole('button',{name:'Município',exact:true})).toHaveText('Salvador');
  await open(page,'Desanexar');await dialog.getByRole('button',{name:'Desanexar',exact:true}).click();await expect(dialog.getByRole('alert')).toHaveText('Informe a justificativa para desanexar os registros.');
  await dialog.getByRole('textbox',{name:'Justificativa'}).fill('Ocorrências distintas confirmadas no ensaio.');await dialog.getByRole('button',{name:'Desanexar',exact:true}).click();
  await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();await expect(dialog.getByRole('textbox',{name:'Justificativa'})).toHaveValue('Ocorrências distintas confirmadas no ensaio.');
  await dialog.getByRole('button',{name:'Desanexar',exact:true}).click();await dialog.getByRole('button',{name:'Confirmar',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('Registros desanexados e devolvidos');await expect(page.getByText('11–20 de 22 registros',{exact:true})).toBeVisible();
});
test('M08 filtros e campos C009–C026: opções, validade e contexto',async({page})=>{
  await page.getByRole('button',{name:'Expandir Dados do registro'}).click();
  await page.getByRole('button',{name:'Origem',exact:true}).click();expect(await page.getByRole('option').allTextContents()).toEqual(['Todos','Call Center','Correspondência','E-mail','Ofício','Presencial','Ouvidoria','SEI','Telefone']);await page.keyboard.press('Escape');
  await page.getByRole('textbox',{name:'Número do Registro',exact:true}).fill('INEXISTENTE');
  await page.getByRole('button',{name:'Consultar',exact:true}).click();await expect(page.getByText('Nenhum registro foi encontrado para os critérios informados.',{exact:true})).toBeVisible();await expect(page.getByText('0 registros',{exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Próxima página',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();await expect(page.getByText('0 registros',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Consultar',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(10);
  await page.getByRole('button',{name:'Expandir Período e situação'}).click();await page.getByRole('textbox',{name:'Palavra-chave'}).fill('resíduos');
  await page.getByLabel('Data inicial',{exact:true}).fill('2026-10-06');await page.getByRole('button',{name:'Consultar',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Informe a data inicial e a data final.');await expect(page.locator('tbody tr')).toHaveCount(10);
  await shot(page,'Print 26 - Filtros e datas invalidas preservam resultado');
});
test('M09 Select controlado: valor inicial, mouse, teclas, busca acentuada, foco e disabled',async({page})=>{
  await page.evaluate(async()=>{const h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');h.mountSelect();});
  const trigger=page.getByRole('button',{name:'Select de microregressão'});await expect(trigger).toHaveText('Jaguaquara');await expect(page.locator('input[name=municipio]')).toHaveValue('Jaguaquara');
  await trigger.click();await expect(page.getByRole('option',{name:'Jaguaquara'})).toHaveAttribute('aria-selected','true');await page.getByRole('option',{name:'Xique-Xique'}).click();await expect(trigger).toHaveText('Xique-Xique');await expect(trigger).toBeFocused();
  await trigger.press('ArrowDown');await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowUp');await page.keyboard.press('Enter');await expect(trigger).toHaveText('Abaíra');await expect(trigger).toBeFocused();
  await trigger.press('ArrowUp');await page.keyboard.press('End');await page.keyboard.press('Enter');await expect(trigger).toHaveText('Xique-Xique');
  for(const text of ['Abaira','Abaíra']){await trigger.click();await page.getByRole('combobox').fill(text);await expect(page.getByRole('option')).toHaveCount(1);await page.keyboard.press('Enter');await expect(trigger).toHaveText('Abaíra');}
  await trigger.click();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(page.getByRole('listbox')).toHaveCount(0);
  await trigger.click();await page.keyboard.press('Tab');await expect(page.getByRole('button',{name:'Depois',exact:true})).toBeFocused();
  await trigger.focus();await trigger.press('ArrowDown');await page.keyboard.press('Shift+Tab');await expect(page.getByRole('button',{name:'Antes',exact:true})).toBeFocused();
  await trigger.click();await page.getByRole('button',{name:'Antes',exact:true}).click();await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.goto(url);await page.evaluate(async()=>{const h=await import('/qa/cards/dor011-pauta-gestor-microrefino-v2/harness.tsx');h.mountSelect(true);});
  await expect(page.getByRole('button',{name:'Select de microregressão'})).toBeDisabled();await page.getByRole('button',{name:'Select de microregressão'}).evaluate(e=>{e.click();e.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));});await expect(page.getByRole('listbox')).toHaveCount(0);
});
for(const [area,route,creation,controlled] of [
 ['Fiscalização','?rota=fisc-pauta-gestor-registros&escopo=pauta-gestor',null,true],
 ['Fauna','?rota=fauna-especies','Nova Espécie',true],
 ['SEIA V2','?rota=seia-v2&tela=usuarios-roles','Novo Usuário',false],
 ['Unidades de Conservação','?rota=uc-agendamento','Novo Agendamento',true],
])test('M10 regressão consumidor real: '+area,async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:3000/'+route);
  if(creation)await page.getByRole('button',{name:new RegExp(creation)}).click();
  const trigger=page.locator('.fi-select-trigger:visible').first();await expect(trigger).toBeVisible();const initial=await trigger.innerText();
  await trigger.click();const count=await page.getByRole('option').count();expect(count).toBeGreaterThan(0);const last=await page.getByRole('option').last().innerText();
  await page.getByRole('option').last().click();await expect(trigger).toBeFocused();await expect(trigger).toHaveText(controlled?last:initial);
  await trigger.press('ArrowDown');await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowUp');
  const owner=await page.getByRole('combobox').count()?page.getByRole('combobox'):page.getByRole('listbox');await expect(owner).toHaveAttribute('aria-activedescendant',/-0$/);
  const first=await page.getByRole('option').first().innerText();await page.keyboard.press('Enter');await expect(trigger).toHaveText(controlled?first:initial);await expect(trigger).toBeFocused();
  await trigger.press('ArrowUp');await page.keyboard.press('End');await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  if(creation==='Novo Usuário')await expect(page.getByRole('dialog')).toBeVisible();
  await trigger.click();await page.keyboard.press('Tab');await expect(page.getByRole('listbox')).toHaveCount(0);await expect(trigger).not.toBeFocused();
  await trigger.focus();await trigger.press('ArrowDown');await page.keyboard.press('Shift+Tab');await expect(page.getByRole('listbox')).toHaveCount(0);await expect(trigger).not.toBeFocused();
  if(creation==='Novo Usuário'){await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);}
  expect(errors).toEqual([]);
});
test('M11 visual 4K e 390px: tabela rola internamente, modal, foco e disabled',async({page})=>{
  await page.setViewportSize({width:3840,height:2160});await open(page,'Visualizar');await page.getByRole('link',{name:'-12.910000, -38.350000',exact:true}).first().click();await shot(page,'Print 27 - TL011 4K anexos');await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});const scroll=page.locator('.pauta-gestor table').locator('..');const box=await scroll.evaluate(e=>{let p=e;while(p&&p.scrollWidth<=p.clientWidth)p=p.parentElement;return p?{width:p.clientWidth,scroll:p.scrollWidth,overflow:getComputedStyle(p).overflowX}:null;});expect(box).not.toBeNull();expect(box.scroll).toBeGreaterThan(box.width);expect(['auto','scroll']).toContain(box.overflow);
  await open(page,'Arquivar');await pick(page,'Motivo do arquivamento','Outros');await page.getByRole('textbox',{name:'Justificativa'}).focus();await shot(page,'Print 28 - Modal estreito e foco');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

